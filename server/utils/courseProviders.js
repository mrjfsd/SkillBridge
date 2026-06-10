// PATH: resume-builder/server/utils/courseProviders.js
import fetch from 'node-fetch';

const UDEMY_ID = process.env.UDEMY_CLIENT_ID;
const UDEMY_SECRET = process.env.UDEMY_CLIENT_SECRET;
const COURSERA_RAPID = process.env.COURSERA_RAPIDAPI_KEY;
const LL_RAPID = process.env.LL_RAPIDAPI_KEY;

// Simple in-memory cache per skill/provider for 6 hours
const CACHE = new Map();
const TTL_MS = 6 * 60 * 60 * 1000;

function getCacheKey(provider, skill) {
  return `${provider}::${skill.toLowerCase()}`;
}
function setCache(provider, skill, value) {
  CACHE.set(getCacheKey(provider, skill), { value, ts: Date.now() });
}
function getCache(provider, skill) {
  const entry = CACHE.get(getCacheKey(provider, skill));
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    CACHE.delete(getCacheKey(provider, skill));
    return null;
  }
  return entry.value;
}

/**
 * Normalize a list of { title, url, provider, hours? }
 */
function ensureCourses(arr = [], provider) {
  return (arr || [])
    .filter(Boolean)
    .map(item => ({
      title: String(item.title || 'Untitled').slice(0, 140),
      url: String(item.url || '').trim(),
      provider,
      hours: item.hours || undefined,
    }))
    .filter(x => x.url);
}

/** UDEMY */
export async function getUdemyCourses(skill) {
  const cached = getCache('udemy', skill);
  if (cached) return cached;

  // Official Udemy API (requires client id + secret)
  if (UDEMY_ID && UDEMY_SECRET) {
    try {
      const resp = await fetch(`https://www.udemy.com/api-2.0/courses/?search=${encodeURIComponent(skill)}&page_size=6`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': 'Basic ' + Buffer.from(`${UDEMY_ID}:${UDEMY_SECRET}`).toString('base64'),
        },
      });
      if (resp.ok) {
        const json = await resp.json();
        const items = (json.results || []).slice(0, 6).map(c => ({
          title: c.title,
          url: `https://www.udemy.com${c.url}`
        }));
        const normalized = ensureCourses(items, 'Udemy');
        setCache('udemy', skill, normalized);
        return normalized;
      }
    } catch (e) {
      // ignore → fallback
    }
  }

  // Fallback: curated search
  const fallback = ensureCourses([{
    title: `Best ${skill} courses`,
    url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`
  }], 'Udemy');
  setCache('udemy', skill, fallback);
  return fallback;
}

/** COURSERA */
export async function getCourseraCourses(skill) {
  const cached = getCache('coursera', skill);
  if (cached) return cached;

  // Many folks use RapidAPI wrappers for Coursera; support if provided
  if (COURSERA_RAPID) {
    try {
      // Example placeholder – replace with your concrete RapidAPI endpoint if you use one.
      // const resp = await fetch('https://YOUR-COURSERA-RAPIDAPI-ENDPOINT', {
      //   headers: { 'X-RapidAPI-Key': COURSERA_RAPID },
      // });
      // if (resp.ok) { ... }
    } catch (e) {
      // ignore → fallback
    }
  }

  // Fallback: official site search
  const fallback = ensureCourses([{
    title: `Top ${skill} Specializations`,
    url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`
  }], 'Coursera');
  setCache('coursera', skill, fallback);
  return fallback;
}

/** LINKEDIN LEARNING */
export async function getLinkedInLearningCourses(skill) {
  const cached = getCache('linkedin', skill);
  if (cached) return cached;

  if (LL_RAPID) {
    try {
      // Placeholder – if you adopt a RapidAPI for LinkedIn Learning, plug it here.
    } catch (e) {
      // ignore → fallback
    }
  }

  // Fallback: official search
  const fallback = ensureCourses([{
    title: `${skill} Learning Path`,
    url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skill)}`
  }], 'LinkedIn Learning');
  setCache('linkedin', skill, fallback);
  return fallback;
}
