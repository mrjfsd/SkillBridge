// PATH: resume-builder/server/routes/matchRoutes.js
import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import Resume from '../models/Resume.js';
import { serializeResume } from '../utils/serializeResume.js';

const router = express.Router();

// VERY LIGHTWEIGHT matcher (you already had a Python service; this stays on Node for /match UI)
const TECH_WORDS = new Set([
  'java','python','javascript','typescript','react','react.js','node','node.js','express','mongodb',
  'sql','mysql','postgres','docker','kubernetes','aws','gcp','azure','html','css','git','github',
  'spring','spring boot','django','flask','pandas','numpy','ml','machine learning'
]);

function extractSkills(text='') {
  const words = text.toLowerCase().match(/[a-z0-9\.\+\#\-]+/g) || [];
  const found = new Set();
  words.forEach(w => {
    if (TECH_WORDS.has(w)) found.add(w);
    if (w.endsWith('.js') && TECH_WORDS.has(w.replace('.js',''))) found.add(w.replace('.js',''));
  });
  return Array.from(found);
}

router.post('/', protect, async (req, res) => {
  try {
    const { resumeId, job } = req.body;
    const r = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!r) return res.status(404).json({ message: 'Resume not found' });

    const resumeText = serializeResume(r);
    const resumeSkills = extractSkills(resumeText);
    const jobText = `${job.title || ''}. ${job.description || ''} ${job.requirements || ''}`;
    const jobSkills = extractSkills(jobText);

    const setR = new Set(resumeSkills);
    const setJ = new Set(jobSkills);

    const matching = Array.from(jobSkills).filter(s => setR.has(s));
    const missing = Array.from(jobSkills).filter(s => !setR.has(s));

    const score = jobSkills.length ? matching.length / jobSkills.length : 0.0;

    res.json({
      match: {
        job_title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        score,
        matching_skills: matching,
        missing_skills: missing,
        resume_text: resumeText   // ⬅️ used by MatchDetails to ask Gemini
      }
    });
  } catch (e) {
    console.error('match error:', e?.response?.data || e.message);
    res.status(500).json({ message: 'Match failed' });
  }
});

export default router;
