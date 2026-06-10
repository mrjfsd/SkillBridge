// PATH: resume-builder/server/routes/jobRoutes.js
import express from 'express';
import axios from 'axios';
import protect from '../middlewares/authMiddleware.js';
import Resume from '../models/Resume.js';

const router = express.Router();

const SKILLS = ['java','python','javascript','html','css','react','node','express','mongodb','sql'];
const normalize = s => (s || '').toLowerCase();
const uniq = arr => [...new Set(arr)];

function extractSkills(resume) {
  const listed = Array.isArray(resume?.skills) ? resume.skills : [];
  const normalized = listed.map(normalize);
  const hard = normalized
    .map(s => s.replace('.js',''))
    .filter(s => SKILLS.includes(s) || SKILLS.includes(s.replace('.js','')));
  const extras = [];
  if (hard.includes('react')) extras.push('frontend');
  if (hard.includes('node'))  extras.push('backend');
  return uniq([...hard, ...extras]).slice(0, 8);
}

function buildQueries(resume) {
  const skills = extractSkills(resume);
  const role = normalize(resume?.personal_info?.profession || resume?.title || 'software engineer');
  const aliases = uniq([
    role,
    'software engineer',
    'full stack developer',
    'react developer',
    'backend developer',
    'software engineer intern'
  ]);
  return uniq([
    `${aliases[0]} ${skills.slice(0,4).join(' ')}`,
    `${aliases[1]} ${skills.slice(0,4).join(' ')}`,
    `react node mongodb full stack developer`,
    `software engineer intern java react`
  ]);
}

function portalOf(url = '', publisher = '') {
  const u = (url || '').toLowerCase();
  const p = (publisher || '').toLowerCase();
  if (u.includes('linkedin') || p.includes('linkedin')) return 'linkedin';
  if (u.includes('indeed')  || p.includes('indeed'))  return 'indeed';
  if (u.includes('naukri')  || p.includes('naukri'))  return 'naukri';
  if (u.includes('foundit') || p.includes('monster')) return 'foundit';
  return 'other';
}

function scoreCard(card, skills) {
  const hay = normalize(`${card.title} ${card.description} ${card.requirements}`);
  let score = skills.reduce((acc, s) => acc + (hay.includes(s) ? 1 : 0), 0);
  if (skills.some(s => normalize(card.title).includes(s))) score += 1;
  return score;
}

async function searchJobs(apiKey, query) {
  const resp = await axios.get('https://jsearch.p.rapidapi.com/search', {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
    params: {
      query,
      page: 1,
      num_pages: 1,
      country: 'IN',
      date_posted: 'week',
      employment_types: 'FULLTIME,PARTTIME,INTERN,CONTRACTOR',
      remote_jobs_only: false,
    },
    timeout: 15000,
  });
  return resp?.data?.data || [];
}

router.get('/by-resume/:resumeId', protect, async (req, res) => {
  try {
    const apiKey = process.env.JSEARCH_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'RapidAPI key missing' });

    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const queries = buildQueries(resume);
    const wantedSkills = extractSkills(resume);

    let jobs = [];
    for (const q of queries) {
      const batch = await searchJobs(apiKey, q);
      jobs = jobs.concat(batch);
      if (jobs.length >= 40) break;
    }

    const cards = jobs.map(job => {
      const url = job.job_apply_link || job.job_apply_links?.[0] || job.job_google_link || '';
      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name || '',
        location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', '),
        apply_url: url,
        portal: portalOf(url, job.job_publisher),
        description: job.job_description || '',
        requirements: job.job_highlights?.Qualifications?.join(' ') || '',
        skills: job.job_highlights?.Qualifications || [],
      };
    });

    const ranked = cards
      .map(card => ({ ...card, _score: scoreCard(card, wantedSkills) }))
      .sort((a,b) => b._score - a._score)
      .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i)
      .slice(0, 20)
      .map(({ _score, ...rest }) => rest);

    res.json({ jobs: ranked });
  } catch (err) {
    console.error('Job search error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// New route to get match details
router.get('/:resumeId/:jobId', protect, async (req, res) => {
  try {
    const { resumeId, jobId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const queries = buildQueries(resume);
    const wantedSkills = extractSkills(resume);

    let jobs = [];
    for (const q of queries) {
      const batch = await searchJobs(process.env.JSEARCH_API_KEY, q);
      jobs = jobs.concat(batch);
    }

    const job = jobs.find(j => j.job_id === jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const jobSkills = job.job_highlights?.Qualifications || [];
    const matchingSkills = wantedSkills.filter(skill => jobSkills.some(req => req.toLowerCase().includes(skill)));
    const missingSkills = jobSkills.filter(req => !wantedSkills.some(skill => req.toLowerCase().includes(skill)));

    const matchScore = Math.round((matchingSkills.length / (jobSkills.length || 1)) * 100);
    const roadmap = missingSkills.map(skill => `Learn: ${skill}`);

    res.json({
      jobTitle: job.job_title,
      company: job.employer_name,
      location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', '),
      apply_url: job.job_apply_link || '',
      matchScore,
      matchingSkills,
      missingSkills,
      roadmap
    });
  } catch (err) {
    console.error('Match fetch error:', err.message);
    res.status(500).json({ message: 'Unable to fetch match details' });
  }
});

export default router;
