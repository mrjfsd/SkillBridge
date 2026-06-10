// PATH: resume-builder/server/services/gemini.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai;

function getAI() {
  if (!apiKey) throw new Error("GEMINI_API_KEY missing in .env");
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

/**
 * Clean markdown formatting from text while preserving structure
 */
function cleanMarkdown(text) {
  if (!text) return text;

  return (
    text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove bold
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      // Remove italic
      .replace(/\*([^*]+)\*/g, "$1")
      // Remove headers but keep the text
      .replace(/^#{1,6}\s+(.+)$/gm, "$1")
      // Remove strikethrough
      .replace(/~~([^~]+)~~/g, "$1")
      // Normalize bullet points to use dash
      .replace(/^[•●◦▪▫]\s+/gm, "- ")
      // Clean up multiple spaces but preserve line structure
      .replace(/ {2,}/g, " ")
      .trim()
  );
}

/**
 * Ask Gemini to give *targeted* resume improvements for a specific job.
 * Returns plain text suggestions; you can render as markdown/HTML in client.
 */
export async function suggestResumeImprovements(resumeText, jobDesc) {
  try {
    const prompt = `You are an expert ATS coach. Give precise, bullet-pointed suggestions to tailor a resume for a specific job.

Rules:
- Focus ONLY on technical content and measurable impact.
- Prefer skill phrasing over soft skills.
- Show a short "Summary Rewrite" (6-8 lines), "Keywords to Add", "Bullet Tweaks", and "Optional Projects".
- Keep under 60 lines total.
- Format output as clear sections with bullet points using dash (-)
- Use PLAIN TEXT ONLY - no markdown formatting like asterisks or underscores
- Each bullet point should start with a dash (-) followed by a space
- Keep proper line breaks between sections

Example format:
Summary Rewrite:
- Point one
- Point two

Keywords to Add:
- Keyword 1
- Keyword 2

RESUME:
${resumeText?.slice(0, 30_000) || ""}

JOB DESCRIPTION:
${jobDesc?.slice(0, 30_000) || ""}

Now produce the improved guidance in plain text format with clear bullet points.`;

    console.log("Calling Gemini API...");
    const genAI = getAI();

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("Gemini API response received");

    const rawText = response.text || "No suggestions.";
    const cleanedText = cleanMarkdown(rawText);

    return cleanedText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    console.error("Error message:", error.message);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
}
