// PATH: resume-builder/server/controllers/aiController.js
import Resume from '../models/Resume.js';
import { suggestResumeImprovements } from '../services/gemini.js';
import { serializeResume } from '../utils/serializeResume.js';
import ai from '../configs/ai.js';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SECTION_HEADERS = {
  summary: ['summary', 'professional summary', 'profile', 'objective'],
  experience: ['experience', 'work experience', 'employment history', 'professional experience'],
  education: ['education', 'academic history', 'academics'],
  skills: ['skills', 'technical skills', 'core competencies', 'skill set'],
  projects: ['projects', 'project experience', 'project highlights'],
};

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function cleanWhitespace(str = '') {
  return str.replace(/\s+/g, ' ').trim();
}

function stripCodeFences(text = '') {
  return text.replace(/```json/gi, '```').replace(/```/g, '').trim();
}

async function runAI(systemPrompt, userPrompt) {
  if (!process.env.OPENAI_API_KEY) return null;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
  const baseURL = process.env.OPENAI_BASE_URL || '';
  const preferResponses = !baseURL || /openai\.com\/v1\b/i.test(baseURL);

  if (preferResponses) {
    try {
      const response = await ai.responses.create({
        model: OPENAI_MODEL,
        input: [
          { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
          { role: 'user', content: [{ type: 'text', text: userPrompt }] },
        ],
      });
      const text = response?.output_text?.trim();
      if (text) return text;
      const fallback = response?.output?.[0]?.content?.[0]?.text?.trim();
      if (fallback) return fallback;
    } catch (error) {
      // Most non-OpenAI compatible endpoints (e.g. Gemini) will 404 on /responses.
      if (error?.status !== 404) {
        console.warn('AI service error (responses):', error?.response?.data || error.message);
      }
    }
  }

  try {
    const chat = await ai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.6,
    });
    const choice = chat?.choices?.[0]?.message?.content;
    if (!choice) return null;
    if (Array.isArray(choice)) {
      return choice.map((chunk) => chunk?.text || '').join('').trim() || null;
    }
    if (typeof choice === 'string') return choice.trim();
    return null;
  } catch (error) {
    console.warn('AI service error (chat):', error?.response?.data || error.message);
    return null;
  }
}

function extractFromPrompt(prompt = '') {
  if (!prompt) return '';
  const quoted = [...prompt.matchAll(/"([^"]+)"/g)].pop();
  if (quoted && quoted[1]) return quoted[1];
  const descMatch = prompt.match(/description\s+(.+?)(?:\s+for\s+the\s+position|\s+for\s+the\s+role|\s+at\s)/i);
  if (descMatch && descMatch[1]) return descMatch[1].trim();
  const cleaned = prompt.replace(/^(enhance|rewrite)[^:]+:/i, '').trim();
  return cleaned || prompt.trim();
}

function fallbackSummaryRewrite(text = '') {
  if (!text) return '';
  const tidy = cleanWhitespace(text);
  const sentences = tidy.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences
    .slice(0, 4)
    .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(' ');
}

function fallbackBulletRewrite(text = '') {
  if (!text) return '';
  const tidy = text.replace(/[\r\n]+/g, ' ');
  const parts = tidy
    .split(/(?:\u2022|-)/)
    .map((part) => cleanWhitespace(part))
    .filter(Boolean);
  if (parts.length === 0) {
    return `- ${cleanWhitespace(tidy)}`;
  }
  return parts
    .map((part) => `- ${part}`)
    .slice(0, 6)
    .join('\n');
}

function splitSections(raw = '') {
  const sections = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };
  let current = 'summary';
  const lines = raw.replace(/\r/g, '').split('\n');
  for (const original of lines) {
    const line = original.trim();
    const normalized = line.toLowerCase().replace(/[:]+$/, '');
    const detected = Object.entries(SECTION_HEADERS).find(([, names]) =>
      names.some((name) => normalized === name || normalized.startsWith(`${name} `)),
    );
    if (detected) {
      current = detected[0];
      continue;
    }
    sections[current].push(line);
  }
  return sections;
}

function detectPersonalInfo(resumeText = '') {
  const lines = resumeText.replace(/\r/g, '').split('\n').map((line) => line.trim()).filter(Boolean);
  const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = resumeText.match(/(\+?\d[\d\s().-]{7,})/);
  const locationMatch = lines.find((line) => /[A-Za-z],[ A-Za-z]/.test(line) && !/@/.test(line));
  const nameCandidate = lines.find(
    (line) => /^[A-Za-z][A-Za-z\s'.-]{2,}$/.test(line) && !line.includes('@') && line.split(' ').length <= 5,
  );

  return {
    full_name: nameCandidate || '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? cleanWhitespace(phoneMatch[0]) : '',
    location: locationMatch || '',
    profession: '',
    linkedin: '',
    website: '',
  };
}

function extractSkillsText(text = '') {
  if (!text) return [];
  return [
    ...new Set(
      text
        .split(/(?:\u2022|,|;|\||\n)/)
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => token.replace(/[^a-z0-9 +#()./-]/gi, ''))
        .filter(Boolean),
    ),
  ].slice(0, 30);
}

function normalizeDate(raw = '') {
  if (!raw) return '';
  const cleaned = raw.toString().trim();
  if (/present|current/i.test(cleaned)) return '';

  const isoLike = cleaned.match(/^(\d{4})-(\d{2})$/);
  if (isoLike) return `${isoLike[1]}-${isoLike[2]}`;

  const monthMatch = cleaned.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*(\d{4})/i,
  );
  if (monthMatch) {
    const monthIndex = MONTH_NAMES.indexOf(monthMatch[1].slice(0, 3).toLowerCase());
    if (monthIndex >= 0) {
      const month = (monthIndex + 1).toString().padStart(2, '0');
      return `${monthMatch[2]}-${month}`;
    }
  }

  const yearMatch = cleaned.match(/(20|19)\d{2}/);
  if (yearMatch) return `${yearMatch[0]}-01`;
  return '';
}

function parseBulletBlocks(lines = []) {
  const joined = lines.join('\n').replace(/\u2022/g, '\n- ').trim();
  if (!joined) return [];
  return joined
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length >= 10);
}

function guessExperience(entries = []) {
  return entries.slice(0, 8).map((entry) => {
    const lines = entry.split('\n').map((line) => line.trim()).filter(Boolean);
    const header = lines.shift() || '';
    const desc = lines.join('\n').trim() || entry;

    const roleCompanyMatch = header.match(
      /^(?<position>.+?)(?:\s+at\s+|\s*@\s*|\s+-\s+|\s+\|\s+)(?<company>.+?)(?:\s*\(|$|\s+-|\s+\|)/i,
    );
    const datesMatch = entry.match(
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{2,4}|\d{4})(?:\s*[-–]\s*((?:present|current)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{2,4}|\d{4}))?/i,
    );

    const startDate = datesMatch ? normalizeDate(datesMatch[1]) : '';
    const endRaw = datesMatch && datesMatch[2] ? datesMatch[2] : '';
    const endDate = normalizeDate(endRaw);
    const isCurrent = /present|current/i.test(endRaw || entry);

    return {
      company: roleCompanyMatch?.groups?.company?.trim() || '',
      position: roleCompanyMatch?.groups?.position?.trim() || header,
      start_date: startDate,
      end_date: isCurrent ? '' : endDate,
      description: desc,
      is_current: isCurrent,
    };
  });
}

function guessEducation(entries = []) {
  return entries.slice(0, 6).map((entry) => {
    const lines = entry.split('\n').map((line) => line.trim()).filter(Boolean);
    const header = lines.shift() || entry;
    const degreeMatch = entry.match(
      /(b\.?tech|b\.?e\.?|bachelor|master|m\.?tech|mba|bsc|msc|phd|diploma)/i,
    );
    const institutionMatch = header.match(/(?:at|from)\s+(.+)/i);
    const dateMatch =
      entry.match(
        /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*(\d{4}))/i,
      ) || entry.match(/((?:20|19)\d{2})/);
    const gpaMatch = entry.match(/(?:cgpa|gpa)[:\s]+([0-9.]+)/i);

    return {
      institution: institutionMatch ? institutionMatch[1].trim() : header,
      degree: degreeMatch ? degreeMatch[0].toUpperCase() : '',
      field: '',
      graduation_date: dateMatch ? `${dateMatch[1]}-01` : '',
      gpa: gpaMatch ? gpaMatch[1] : '',
    };
  });
}

function guessProjects(entries = []) {
  return entries.slice(0, 6).map((entry) => {
    const lines = entry.split('\n').map((line) => line.trim()).filter(Boolean);
    const header = lines.shift() || '';
    return {
      name: header || 'Project',
      type: '',
      description: lines.join('\n').trim() || entry,
    };
  });
}

function fallbackSummary(resumeText = '', summaryLines = []) {
  const joined = cleanWhitespace(summaryLines.join(' '));
  if (joined) return joined;
  const sentences = cleanWhitespace(resumeText).split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 3).join(' ');
}

function heuristicParse(resumeText = '') {
  const sections = splitSections(resumeText);
  const summary = fallbackSummary(resumeText, sections.summary);
  const personal_info = detectPersonalInfo(resumeText);
  const skillsSource = sections.skills.length ? sections.skills.join('\n') : resumeText;
  const skills = extractSkillsText(skillsSource);
  const experienceEntries = parseBulletBlocks(sections.experience);
  const educationEntries = parseBulletBlocks(sections.education);
  const projectEntries = parseBulletBlocks(sections.projects);

  return {
    professional_summary: summary,
    skills,
    experience: guessExperience(experienceEntries),
    education: guessEducation(educationEntries),
    projects: guessProjects(projectEntries),
    personal_info,
  };
}

async function parseWithAI(resumeText = '') {
  const systemPrompt = `You convert resumes into strict JSON. Return ONLY JSON following this schema:
{
  "professional_summary": string,
  "skills": string[],
  "experience": [
    { "company": string, "position": string, "start_date": "YYYY-MM" or "", "end_date": "YYYY-MM" or "", "description": string, "is_current": boolean }
  ],
  "education": [
    { "institution": string, "degree": string, "field": string, "graduation_date": "YYYY-MM" or "", "gpa": string }
  ],
  "projects": [
    { "name": string, "type": string, "description": string }
  ],
  "personal_info": {
    "full_name": string,
    "email": string,
    "phone": string,
    "location": string,
    "profession": string,
    "linkedin": string,
    "website": string
  }
}
Fill unknown values with "" or [] and do not include explanations.`;

  const result = await runAI(systemPrompt, `Resume text:\n${resumeText}\n\nReturn JSON as specified.`);
  if (!result) return null;
  const stripped = stripCodeFences(result);
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.warn('parseWithAI JSON parse failed:', error.message);
    return null;
  }
}

async function parseResumeText(resumeText = '') {
  const aiParsed = await parseWithAI(resumeText);
  if (aiParsed) return aiParsed;
  return heuristicParse(resumeText);
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSkills(skills) {
  return normalizeArray(skills)
    .map((skill) => cleanWhitespace(skill))
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeExperience(experience) {
  return normalizeArray(experience)
    .slice(0, 12)
    .map((item) => {
      const desc = (item?.description || '').toString().trim();
      const endRaw = item?.end_date || '';
      const computedCurrent = Boolean(item?.is_current || /present|current/i.test(endRaw || desc));
      return {
        company: cleanWhitespace(item?.company || ''),
        position: cleanWhitespace(item?.position || ''),
        start_date: normalizeDate(item?.start_date || ''),
        end_date: computedCurrent ? '' : normalizeDate(endRaw),
        description: desc,
        is_current: computedCurrent,
      };
    })
    .filter((entry) => entry.company || entry.position || entry.description);
}

function normalizeEducation(education) {
  return normalizeArray(education)
    .slice(0, 10)
    .map((item) => ({
      institution: cleanWhitespace(item?.institution || ''),
      degree: cleanWhitespace(item?.degree || ''),
      field: cleanWhitespace(item?.field || ''),
      graduation_date: normalizeDate(item?.graduation_date || ''),
      gpa: cleanWhitespace(item?.gpa || ''),
    }))
    .filter((entry) => entry.institution || entry.degree || entry.field);
}

function normalizeProjects(projects) {
  return normalizeArray(projects)
    .slice(0, 10)
    .map((item) => ({
      name: cleanWhitespace(item?.name || ''),
      type: cleanWhitespace(item?.type || ''),
      description: (item?.description || '').toString().trim(),
    }))
    .filter((entry) => entry.name || entry.description);
}

function normalizePersonalInfo(info = {}) {
  return {
    image: '',
    full_name: cleanWhitespace(info.full_name || ''),
    profession: cleanWhitespace(info.profession || ''),
    email: cleanWhitespace(info.email || ''),
    phone: cleanWhitespace(info.phone || ''),
    location: cleanWhitespace(info.location || ''),
    linkedin: cleanWhitespace(info.linkedin || ''),
    website: cleanWhitespace(info.website || ''),
  };
}

export async function enhanceProfessionalSummary(req, res) {
  try {
    const { summary, userContent } = req.body || {};
    const baseText = cleanWhitespace(summary || extractFromPrompt(userContent));
    if (!baseText) {
      return res.status(400).json({ message: 'summary is required' });
    }

    const systemPrompt =
      'You are an expert career coach. Rewrite the provided professional summary so it is concise (3-5 sentences), achievement-oriented, and uses strong action verbs. Return plain text without markdown.';
    const userPrompt = `Current summary:\n${baseText}\n\nRewrite this summary following the rules.`;
    const aiResult = await runAI(systemPrompt, userPrompt);
    const enhancedContent = aiResult?.trim() || fallbackSummaryRewrite(baseText);
    return res.json({ enhancedContent });
  } catch (error) {
    console.error('enhanceProfessionalSummary error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to enhance summary' });
  }
}

export async function enhanceJobDescription(req, res) {
  try {
    const { description, userContent } = req.body || {};
    const baseText = cleanWhitespace(description || extractFromPrompt(userContent));
    if (!baseText) {
      return res.status(400).json({ message: 'description is required' });
    }

    const systemPrompt =
      'You are an expert resume writer. Rewrite job responsibility text into 3-5 concise bullet points, each starting with a strong action verb and (when data exists) including measurable impact. Return plain text bullets separated by newlines.';
    const userPrompt = `Current description:\n${baseText}\n\nProvide improved bullet points.`;
    const aiResult = await runAI(systemPrompt, userPrompt);
    const enhancedContent = aiResult?.trim() || fallbackBulletRewrite(baseText);
    return res.json({ enhancedContent });
  } catch (error) {
    console.error('enhanceJobDescription error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to enhance job description' });
  }
}

export async function uploadResume(req, res) {
  try {
    const { title, resumeText } = req.body || {};
    if (!title || !resumeText) {
      return res.status(400).json({ message: 'title and resumeText are required' });
    }

    const parsed = await parseResumeText(resumeText);

    const resumePayload = {
      userId: req.userId,
      title: cleanWhitespace(title) || 'Uploaded Resume',
      professional_summary: cleanWhitespace(parsed?.professional_summary || '').slice(0, 2000),
      skills: normalizeSkills(parsed?.skills || []),
      experience: normalizeExperience(parsed?.experience || parsed?.experiences || []),
      education: normalizeEducation(parsed?.education || []),
      project: normalizeProjects(parsed?.projects || []),
      personal_info: normalizePersonalInfo(parsed?.personal_info || detectPersonalInfo(resumeText)),
    };

    const created = await Resume.create(resumePayload);
    return res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: created._id,
    });
  } catch (error) {
    console.error('uploadResume error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to upload resume' });
  }
}

/**
 * POST /api/ai/improve-resume
 * Body: { resumeText?, resumeId?, jobDesc }
 */
export async function improveResume(req, res) {
  try {
    const { resumeText, resumeId, jobDesc } = req.body;
    let text = resumeText || '';

    if (!text && resumeId) {
      const r = await Resume.findOne({ _id: resumeId, userId: req.userId });
      if (!r) return res.status(404).json({ message: 'Resume not found' });
      text = serializeResume(r);
    }
    if (!text) return res.status(400).json({ message: 'resumeText or resumeId required' });
    if (!jobDesc) return res.status(400).json({ message: 'jobDesc required' });

    const suggestions = await suggestResumeImprovements(text, jobDesc);
    res.json({ suggestions });
  } catch (e) {
    console.error('improve-resume error:', e?.response?.data || e.message);
    res.status(500).json({ message: 'Failed to generate resume improvements' });
  }
}
