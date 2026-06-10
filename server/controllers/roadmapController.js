// PATH: resume-builder/server/controllers/roadmapController.js
import {
  getUdemyCourses,
  getCourseraCourses,
  getLinkedInLearningCourses
} from '../utils/courseProviders.js';

// Allow only technical skills in roadmap
const TECH_WHITELIST = new Set([
  'java','python','javascript','typescript','react','react.js','next.js','node','node.js','express',
  'mongodb','postgres','mysql','sql','redis',
  'docker','kubernetes','aws','gcp','azure',
  'git','github','linux','html','css','tailwind',
  'jest','cypress','webpack','vite',
  'spring','spring boot','django','flask',
  'pandas','numpy','ml','machine learning','deep learning','nlp','opencv',
]);

function filterTechSkills(skills = []) {
  return skills
    .map(s => s?.toLowerCase().trim())
    .filter(Boolean)
    .filter(s => TECH_WHITELIST.has(s))
    .slice(0, 6); // keep concise
}

/**
 * POST /api/roadmap
 * Body: { missingSkills: string[], weeks?: number }
 * Response: { roadmap: [{ skill, plan: [{week, resources:[{title,url,provider,hours?}]}], outcome }] }
 */
export async function generateRoadmap(req, res) {
  try {
    const { missingSkills = [], weeks = 4 } = req.body;
    const skills = filterTechSkills(missingSkills);

    const roadmap = [];
    for (const skill of skills) {
      // Fetch from all providers (each returns 1..6 items; always at least 1 via fallback)
      const [u, c, l] = await Promise.all([
        getUdemyCourses(skill),
        getCourseraCourses(skill),
        getLinkedInLearningCourses(skill),
      ]);
      const all = [...u, ...c, ...l].slice(0, 6);

      // Distribute ~2 resources per week
      const perWeek = Math.max(1, Math.ceil(all.length / weeks));
      const plan = Array.from({ length: weeks }, (_, idx) => {
        const start = idx * perWeek;
        const end = start + perWeek;
        const resources = all.slice(start, end);
        return { week: idx + 1, resources };
      }).filter(w => w.resources.length > 0);

      roadmap.push({
        skill,
        plan,
        outcome: `By week ${weeks}, gain intermediate proficiency in ${skill} with hands-on practice and portfolio-friendly work.`
      });
    }

    res.json({ roadmap });
  } catch (e) {
    console.error('generateRoadmap error:', e?.response?.data || e.message);
    res.status(500).json({ message: 'Failed to generate roadmap' });
  }
}
