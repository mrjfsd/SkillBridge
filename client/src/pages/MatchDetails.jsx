// PATH: resume-builder/client/src/pages/MatchDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import "./MatchDetails.css";

export default function MatchDetails() {
  const { resumeId } = useParams();
  const { state } = useLocation();
  const { job } = state || {};
  const { token } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [improveLoading, setImproveLoading] = useState(false);
  const [improvement, setImprovement] = useState(null);

  useEffect(() => {
    if (!job) {
      setError("Job data missing. Please go back.");
      setLoading(false);
      return;
    }
    const fetchMatchData = async () => {
      try {
        const { data } = await api.post(
          "/api/match",
          { resumeId, job },
          {
            headers: { Authorization: token },
          }
        );
        if (!data.match) throw new Error("Match data missing");
        setMatch(data.match);

        if (data.match.missing_skills.length > 0) {
          const roadmapRes = await api.post(
            "/api/roadmap",
            {
              missingSkills: data.match.missing_skills,
              weeks: 4,
            },
            {
              headers: { Authorization: token },
            }
          );
          setRoadmap(roadmapRes.data.roadmap || []);
        }
      } catch (e) {
        console.error("Match details error:", e);
        setError("Failed to load match details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatchData();
  }, [resumeId, job, token]);

  const handleImproveResume = async () => {
    setImproveLoading(true);
    try {
      const jobDesc =
        job.description ||
        job.job_description ||
        [
          job.title || job.job_title || "",
          job.requirements || "",
          (job.job_highlights?.Qualifications || []).join(" "),
        ].join("\n\n");

      const { data } = await api.post(
        "/api/ai/improve-resume",
        {
          resumeId: resumeId,
          jobDesc: jobDesc,
        },
        { headers: { Authorization: token } }
      );

      setImprovement(data.suggestions || "No suggestions returned.");
    } catch (err) {
      console.error("Improve Resume error:", err);
      setImprovement("Could not generate suggestions. Please try again.");
    } finally {
      setImproveLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="relative">
          <svg className="size-16 animate-spin" viewBox="0 0 16 16" fill="none">
            <circle
              className="opacity-25"
              cx="8"
              cy="8"
              r="7"
              stroke="#30363d"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-75"
              fill="#238636"
              d="M15 8a7 7 0 00-7-7v2a5 5 0 015 5h2z"
            ></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2.5 rounded-full bg-[#238636]"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
        <div className="bg-[#21262d] rounded-lg p-6 border border-[#30363d] max-w-md w-full text-center">
          <div className="bg-[#30363d] inline-flex rounded-lg p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#f85149]"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-[#c9d1d9] mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="match-details min-h-screen bg-[#0d1117] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#c9d1d9] hover:text-[#58a6ff] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Jobs
          </button>
        </div>

        <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#c9d1d9]">
            {match.job_title}
          </h2>
          <p className="text-[#8b949e] mt-1">
            {match.company} • {match.location}
          </p>

          <div className="mt-4 bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="relative size-16">
                <svg viewBox="0 0 120 120" className="size-16">
                  <circle
                    className="text-[#30363d]"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="text-[#238636]"
                    strokeWidth="8"
                    strokeDasharray={340}
                    strokeDashoffset={340 - 340 * match.score}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="60"
                    cy="60"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[#c9d1d9] font-semibold">
                  {(match.score * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#c9d1d9]">
                  Match Score
                </h3>
                <p className="text-[#8b949e]">
                  How well your profile matches the job requirements
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#c9d1d9] mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#238636]"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Matching Skills
            </h3>
            {match.matching_skills.length ? (
              <div className="grid grid-cols-2 gap-2">
                {match.matching_skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-[#238636]/10 text-[#238636] px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8b949e]">No matching skills found</p>
            )}
          </div>

          <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#c9d1d9] mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#f85149]"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Missing Skills
            </h3>
            {match.missing_skills.length ? (
              <div className="grid grid-cols-2 gap-2">
                {match.missing_skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-[#f8514910] text-[#f85149] px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#238636]/10 text-[#238636] px-4 py-3 rounded-md">
                <p className="text-sm font-medium">
                  Perfect Match! No missing skills found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Improvement Section */}
        <div className="mt-6">
          {job && (
            <button
              onClick={handleImproveResume}
              disabled={improveLoading}
              className={`w-full bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                improveLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {improveLoading ? (
                <>
                  <svg
                    className="animate-spin size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.31 9.31 5 21l11.69-4.31M9.31 9.31 3 3l18 18M9.31 9.31 16 2l-4.31 11.69" />
                  </svg>
                  Improve Resume with AI
                </>
              )}
            </button>
          )}

          {improvement && (
            <div className="mt-6 bg-[#21262d] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-medium text-[#c9d1d9] mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#238636]"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                AI Suggestions for Improvement
              </h3>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 text-[#8b949e] whitespace-pre-wrap">
                {improvement}
              </div>
            </div>
          )}
        </div>

        {roadmap.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-[#21262d] to-[#161b22] border border-[#30363d] rounded-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#c9d1d9] mb-6 flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#238636] to-[#2ea043] p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-[#7ee787] via-[#58a6ff] to-[#b392f0] bg-clip-text text-transparent">
                Your Learning Roadmap
              </span>
            </h3>

            <div className="space-y-8">
              {roadmap.map((r, skillIndex) => (
                <div key={r.skill} className="relative">
                  {/* Skill Header - Root Node */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center shadow-lg ring-4 ring-[#238636]/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                          <path d="M12 2v2" />
                          <path d="M12 22v-2" />
                          <path d="m17 20.66-1-1.73" />
                          <path d="M11 10.27 7 3.34" />
                          <path d="m20.66 17-1.73-1" />
                          <path d="m3.34 7 1.73 1" />
                          <path d="M14 12h8" />
                          <path d="M2 12h2" />
                          <path d="m20.66 7-1.73 1" />
                          <path d="m3.34 17 1.73-1" />
                          <path d="m17 3.34-1 1.73" />
                          <path d="m11 13.73-4 6.93" />
                        </svg>
                      </div>
                      {/* Vertical line from root */}
                      <div className="absolute left-1/2 top-12 w-0.5 h-full bg-gradient-to-b from-[#238636] to-transparent -translate-x-1/2"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-xl font-bold text-[#c9d1d9] mb-2">
                        {r.skill}
                      </h4>
                      <p className="text-[#8b949e] text-sm">
                        Master this skill in {r.plan.length} weeks
                      </p>
                    </div>
                  </div>

                  {/* Week Nodes - Tree Branches */}
                  <div className="ml-6 space-y-6">
                    {r.plan.map((week, weekIndex) => (
                      <div
                        key={week.week}
                        className="relative flex items-start gap-4"
                      >
                        {/* Horizontal connector */}
                        <div className="absolute left-0 top-6 w-6 h-0.5 bg-[#30363d]"></div>

                        {/* Week Node */}
                        <div className="relative flex-shrink-0 z-10">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] flex items-center justify-center shadow-lg ring-4 ring-[#58a6ff]/20">
                            <span className="text-white font-bold text-sm">
                              {week.week}
                            </span>
                          </div>
                          {/* Vertical line to resources */}
                          {week.resources.length > 0 && (
                            <div className="absolute left-1/2 top-10 w-0.5 h-full bg-gradient-to-b from-[#58a6ff] to-[#30363d] -translate-x-1/2"></div>
                          )}
                        </div>

                        {/* Week Content */}
                        <div className="flex-1 pt-1">
                          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-gradient-to-r from-[#58a6ff] to-[#1f6feb] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Week {week.week}
                              </span>
                              <span className="text-[#8b949e] text-xs">
                                {week.resources.length} resource
                                {week.resources.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            {/* Resource Leaves */}
                            <div className="space-y-2">
                              {week.resources.map((res, idx) => (
                                <div
                                  key={idx}
                                  className="relative flex items-start gap-3 pl-4"
                                >
                                  {/* Leaf connector */}
                                  <div className="absolute left-0 top-3 w-3 h-0.5 bg-[#30363d]"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#238636] mt-2 flex-shrink-0"></div>

                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex-1 flex items-start gap-2 bg-[#21262d] hover:bg-[#30363d] p-3 rounded-md transition-all hover:translate-x-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-[#8b949e] group-hover:text-[#58a6ff] mt-1 flex-shrink-0 transition-colors"
                                    >
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                      <polyline points="15 3 21 3 21 9" />
                                      <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    <div className="flex-1">
                                      <div className="text-[#c9d1d9] group-hover:text-[#58a6ff] font-medium text-sm transition-colors">
                                        {res.title}
                                      </div>
                                      {res.provider && (
                                        <div className="text-[#8b949e] text-xs mt-0.5 flex items-center gap-1">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                          </svg>
                                          {res.provider}
                                        </div>
                                      )}
                                    </div>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Outcome Section */}
                  <div className="mt-6 ml-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8957e5] to-[#6e40c9] flex items-center justify-center shadow-lg ring-4 ring-[#8957e5]/20 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#8957e5]/10 to-transparent border border-[#8957e5]/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#b392f0] font-semibold text-sm">
                          Expected Outcome
                        </span>
                      </div>
                      <p className="text-[#8b949e] text-sm leading-relaxed">
                        {r.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Separator between skills */}
                  {skillIndex < roadmap.length - 1 && (
                    <div className="mt-8 pt-8 border-t border-[#30363d]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full md:w-auto bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-6 py-2 rounded-md transition-colors"
        >
          ← Back to Jobs
        </button>
      </div>
    </div>
  );
}
