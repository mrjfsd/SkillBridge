// PATH: resume-builder/server/controllers/matchController.js
import Resume from '../models/Resume.js';
import { getResumeImprovementSuggestions } from '../services/gemini.js';
import { buildLearningPlan } from '../services/courses.js';

// ---- helpers ----
const TECH_WHITELIST = new Set([
  // hard/technical signals only (lowercase)
  'java','javascript','typescript','python','c','c++','c#',
  'react','next.js','vue','angular','node','node.js','express',
  'spring','spring boot','django','flask','fastapi',
  'html','css','sass','tailwind','bootstrap',
  'sql','mysql','postgres','mongodb','redis','elasticsearch',
  'docker','kubernetes','git','github','gitlab',
  'aws','gcp','azure','firebase',
  'jest','pytest','mocha','junit','cypress','playwright',
  'rest','graphql','grpc','kafka','rabbitmq',
  'ml','machine learning','pandas','numpy','pytorch','tensorflow',
  'data structures','algorithms'
]);

function norm(s = '') { return String(s).toLowerCase(); }
function tokenize(text = '') {
  // very simple tokenization; you can plug in your NLP here
  return norm(text)
    .replace(/[^a-z0-9+.# ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
function extractTechSkills(text = '') {
  const tokens = tokenize(text);
  // include single/two-word combos often used as a skill
  const pairs = [];
  for (let i = 0; i < tokens.length - 1; i++) pairs.push(`${tokens[i]} ${tokens[i+1]}`);
  const all = new Set([...tokens, ...pairs]);
  return [...all].filter(t => TECH_WHITELIST.has(t));
}
function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...a, ...b]).size || 1;
  return inter / uni;
}

// ---- routes handlers ----

// POST /api/match
export const getMatchDetails = async (req, res) => {
  try {
    const { resumeId, job } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume || !job) {
      return res.status(400).json({ message: 'Bad request: missing resume or job' });
    }

    // Build a plain text resume for extraction
    const resumeText = [
      resume.title,
      (Array.isArray(resume.skills) ? resume.skills.join(', ') : ''),
      ...(Array.isArray(resume.experiences)
        ? resume.experiences.map(e => `${e.role} ${e.company} ${e.description || ''}`)
        : [])
    ].join('\n');

    const jobText = [
      job.title || job.job_title || '',
      job.description || job.job_description || '',
      job.requirements || (job.job_highlights?.Qualifications || []).join(' ')
    ].join('\n');

    const resumeTech = extractTechSkills(resumeText);
    const jobTech    = extractTechSkills(jobText);

    const score = jaccard(resumeTech, jobTech);
    const matching = resumeTech.filter(x => new Set(jobTech).has(x));
    const missing  = jobTech.filter(x => !new Set(resumeTech).has(x));

    const result = {
      job_title: job.title || job.job_title || 'Job',
      company: job.company || job.employer_name || '',
      location: job.location || [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', '),
      score,
      matching_skills: matching,
      missing_skills: missing
    };

    return res.json({ match: result });
  } catch (err) {
    console.error('MATCH ERROR:', err);
    res.status(500).json({ message: 'Failed to compute match' });
  }
};

// POST /api/improve
export const improveResume = async (req, res) => {
  try {
    const { resumeId, job } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume || !job) return res.status(400).json({ message: 'Missing data' });

    const resumeText = [
      resume.title,
      (Array.isArray(resume.skills) ? resume.skills.join(', ') : ''),
      ...(Array.isArray(resume.experiences)
        ? resume.experiences.map(e => `${e.role} at ${e.company}: ${e.description || ''}`)
        : [])
    ].join('\n');

    const jobText = [
      job.title || job.job_title || '',
      job.description || job.job_description || '',
      job.requirements || (job.job_highlights?.Qualifications || []).join(' ')
    ].join('\n');

    const suggestions = await getResumeImprovementSuggestions(resumeText, jobText);
    res.json({ suggestions });
  } catch (err) {
    console.error('IMPROVE ERROR:', err);
    res.json({ suggestions: 'Could not generate suggestions.' });
  }
};

// POST /api/roadmap
export const generateRoadmap = async (req, res) => {
  try {
    const { missingSkills = [], weeks = 4 } = req.body;
    const top = [...new Set(missingSkills)].slice(0, 6); // cap for performance
    const roadmap = [];
    for (const skill of top) {
      roadmap.push(await buildLearningPlan(skill, weeks));
    }
    res.json({ roadmap });
  } catch (err) {
    console.error('ROADMAP ERROR:', err);
    res.status(500).json({ message: 'Failed to build roadmap' });
  }
};
