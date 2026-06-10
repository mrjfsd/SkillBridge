// PATH: resume-builder/server/utils/serializeResume.js
// Turn your resume DB object into a plain text blob Gemini can reason about.
export function serializeResume(resumeDoc = {}) {
  const p = resumeDoc.personal_info || {};
  const lines = [];

  if (p.fullname) lines.push(`# ${p.fullname}`);
  if (p.profession) lines.push(`Profession: ${p.profession}`);
  if (p.email || p.phone) lines.push(`Contact: ${p.email || ''} ${p.phone || ''}`.trim());

  if (resumeDoc.summary) {
    lines.push('\nSummary:\n' + resumeDoc.summary);
  }
  if (Array.isArray(resumeDoc.skills) && resumeDoc.skills.length) {
    lines.push('\nSkills:\n- ' + resumeDoc.skills.join('\n- '));
  }
  if (Array.isArray(resumeDoc.experiences)) {
    lines.push('\nExperience:');
    resumeDoc.experiences.forEach(e => {
      lines.push(`- ${e.title || ''} @ ${e.company || ''} (${e.startDate || ''} – ${e.endDate || 'Present'})`);
      if (Array.isArray(e.points)) e.points.forEach(pt => lines.push(`  • ${pt}`));
    });
  }
  if (Array.isArray(resumeDoc.projects)) {
    lines.push('\nProjects:');
    resumeDoc.projects.forEach(pj => {
      lines.push(`- ${pj.name || ''}: ${pj.description || ''}`);
      if (Array.isArray(pj.technologies)) lines.push(`  Tech: ${pj.technologies.join(', ')}`);
    });
  }
  if (Array.isArray(resumeDoc.education)) {
    lines.push('\nEducation:');
    resumeDoc.education.forEach(ed => lines.push(`- ${ed.degree || ''} @ ${ed.institution || ''} (${ed.year || ''})`));
  }
  return lines.join('\n');
}
