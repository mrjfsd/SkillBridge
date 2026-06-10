// PATH: resume-builder/server/routes/recommendationRoutes.js
import express from 'express';
import axios from 'axios';
import protect from '../middlewares/authMiddleware.js';
import Resume from '../models/Resume.js';

const recoRouter = express.Router();

/** Keep MERN-weighted top skills */
function pickTopSkills(resumeDoc, limit = 5) {
  const base = new Set();
  if (Array.isArray(resumeDoc?.skills)) {
    resumeDoc.skills.forEach((s) => base.add(String(s).toLowerCase()));
  }
  ['react', 'node', 'express', 'mongodb', 'javascript'].forEach((s) => base.add(s));
  return [...base]
    .map((s) => s.replace(/\.js$/i, ''))
    .filter(Boolean)
    .slice(0, limit);
}

/** JSearch wrapper (filters optional) */
async function jsearch({
  apiKey,
  query,
  page = 1,
  num_pages = 1,
  country,
  remote_jobs_only,
  employment_types,
  date_posted,
}) {
  const resp = await axios.get('https://jsearch.p.rapidapi.com/search', {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
    params: {
      query,
      page,
      num_pages,
      // Only include filters if they are defined
      ...(country ? { country } : {}),
      ...(remote_jobs_only !== undefined ? { remote_jobs_only } : {}),
      ...(employment_types ? { employment_types } : {}),
      ...(date_posted ? { date_posted } : {}),
    },
    timeout: 15000,
  });
  return resp?.data?.data || [];
}

recoRouter.get('/:resumeId', protect, async (req, res) => {
  const debug = String(req.query.debug || '').toLowerCase() === 'true';
  const diag = { steps: [] };

  try {
    const {
      JSEARCH_API_KEY,
      JOB_DEFAULT_COUNTRY = 'IN',
      JOB_DEFAULT_LOCATION = 'Mysuru, Karnataka, India',
      JOB_DEFAULT_EMPLOYMENT = 'FULLTIME,INTERN,CONTRACT',
      JOB_DEFAULT_RECENCY = 'week',
      JOB_REMOTE_OK = 'true',
    } = process.env;

    const { resumeId } = req.params;

    // 1) Load resume
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // 2) Build resume text
    const summary = resume.professional_summary || '';
    const expText = Array.isArray(resume.experience)
      ? resume.experience.map(e => [e.title, e.company, e.description].filter(Boolean).join(' ')).join(' ')
      : '';
    const skillsText = Array.isArray(resume.skills) ? resume.skills.join(', ') : '';
    const resumeText = [summary, expText, skillsText].filter(Boolean).join(' ').trim() || 'mern full stack developer react node express mongodb';

    // 3) Queries (tiered: city → country → broad)
    const profession = resume?.personal_info?.profession || resume?.title || 'full stack developer';
    const location = resume?.personal_info?.location || JOB_DEFAULT_LOCATION;
    const topSkills = pickTopSkills(resume, 5);
    const compactSkills = topSkills.join(' ');
    const queries = [
      `${compactSkills} mern developer in ${location}`,
      `${profession} ${compactSkills} in ${location}`,
      `${compactSkills} mern developer in India`,
      `${profession} ${compactSkills} in India`,
      `${profession} ${compactSkills}`,
      `${profession}`,
    ];

    // 4) Progressive search: strict → relaxed → unfiltered
    let jobsArr = [];
    const tries = [
      // Strict: with country + remote + recency + employment
      (q) => jsearch({
        apiKey: JSEARCH_API_KEY,
        query: q,
        country: JOB_DEFAULT_COUNTRY,
        remote_jobs_only: JOB_REMOTE_OK === 'true',
        employment_types: JOB_DEFAULT_EMPLOYMENT,
        date_posted: JOB_DEFAULT_RECENCY,
      }),
      // Relax remote
      (q) => jsearch({
        apiKey: JSEARCH_API_KEY,
        query: q,
        country: JOB_DEFAULT_COUNTRY,
        remote_jobs_only: undefined, // drop remote filter
        employment_types: JOB_DEFAULT_EMPLOYMENT,
        date_posted: JOB_DEFAULT_RECENCY,
      }),
      // Relax recency
      (q) => jsearch({
        apiKey: JSEARCH_API_KEY,
        query: q,
        country: JOB_DEFAULT_COUNTRY,
        employment_types: JOB_DEFAULT_EMPLOYMENT,
        date_posted: 'all',
      }),
      // Drop country (global)
      (q) => jsearch({
        apiKey: JSEARCH_API_KEY,
        query: q,
        // no country
        employment_types: JOB_DEFAULT_EMPLOYMENT,
        date_posted: 'all',
      }),
      // Bare minimum: no filters at all
      (q) => jsearch({ apiKey: JSEARCH_API_KEY, query: q }),
    ];

    for (const q of queries) {
      for (let i = 0; i < tries.length; i++) {
        const jobs = await tries[i](q);
        diag.steps.push({ query: q, phase: i + 1, count: jobs.length });
        if (jobs.length > 0) {
          jobsArr = jobs;
          break;
        }
      }
      if (jobsArr.length > 0) break;
    }

    // 5) If still empty: final hard fallback list (keeps pipeline alive)
    if (jobsArr.length === 0) {
      diag.fallback = true;
      const fake = [
        {
          job_id: 'fake-1',
          job_title: 'MERN Intern',
          employer_name: 'Demo Company',
          job_city: 'Bengaluru', job_state: 'KA', job_country: 'India',
          job_apply_link: 'https://example.com/apply',
          job_description: 'Looking for MERN intern with React, Node, Express, MongoDB.',
          job_highlights: { Qualifications: ['React', 'Node', 'Express', 'MongoDB'] }
        },
        {
          job_id: 'fake-2',
          job_title: 'Full Stack Developer (React/Node)',
          employer_name: 'Demo Labs',
          job_city: 'Remote', job_state: '', job_country: 'India',
          job_apply_link: 'https://example.com/apply2',
          job_description: 'React, Node, REST APIs, MongoDB.',
          job_highlights: { Qualifications: ['React', 'Node', 'REST', 'MongoDB'] }
        }
      ];
      jobsArr = fake;
    }

    // 6) Dedup & cap
    const seen = new Set();
    const picked = [];
    for (const j of jobsArr) {
      if (seen.has(j.job_id)) continue;
      seen.add(j.job_id);
      picked.push(j);
      if (picked.length >= 40) break;
    }

    // 7) Build lookup & Python payload
    const jobById = {};
    for (const j of picked) {
      jobById[j.job_id] = {
        id: j.job_id,
        title: j.job_title || '',
        company: j.employer_name || '',
        location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', '),
        url: j.job_apply_link || j.job_apply_links?.[0] || j.job_google_link || '',
        description: j.job_description || '',
        requirements: Array.isArray(j.job_highlights?.Qualifications)
          ? j.job_highlights.Qualifications.join(' ')
          : '',
      };
    }
    const mappedJobs = Object.values(jobById).map(j => ({
      id: j.id,
      title: j.title,
      description: j.description,
      requirements: j.requirements,
    }));

    // 8) Call Python recommender
    const recoResp = await axios.post(
      'http://localhost:8000/recommend',
      { resume: resumeText, jobs: mappedJobs },
      { timeout: 25000 }
    );
    let recs = recoResp?.data?.recommendations || [];

    // 9) Enrich, sort by score desc, top 10
    recs = recs
      .map(r => ({
        job_id: r.job_id,
        job_title: r.job_title || jobById[r.job_id]?.title || '',
        company: jobById[r.job_id]?.company || '',
        location: jobById[r.job_id]?.location || '',
        url: jobById[r.job_id]?.url || '',
        score: r.score,
        missing_skills: r.missing_skills || [],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // 10) Return with diagnostic info when ?debug=true
    if (debug) return res.json({ recommendations: recs, debug: diag });
    return res.json({ recommendations: recs });
  } catch (err) {
    console.error('Recommendation error:', err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({ message: 'Failed to compute recommendations' });
  }
});

export default recoRouter;
