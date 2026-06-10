// PATH: resume-builder/client/src/pages/JobsList.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import { ExternalLink } from "lucide-react";

const PortalIcon = ({ portal }) => {
  const cls = "inline-block align-middle mr-1";
  if (portal === "linkedin")
    return (
      <img
        className={cls}
        alt="LinkedIn"
        src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
        width="16"
      />
    );
  if (portal === "indeed")
    return (
      <img
        className={cls}
        alt="Indeed"
        src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/indeed.svg"
        width="16"
      />
    );
  if (portal === "naukri")
    return (
      <img
        className={cls}
        alt="Naukri"
        src="https://static.naukimg.com/s/4/100/i/naukri_Logo.png"
        width="16"
      />
    );
  if (portal === "foundit")
    return (
      <img
        className={cls}
        alt="Foundit"
        src="https://img.foundit.in/logo.png"
        width="16"
      />
    );
  return <ExternalLink size={16} className={cls} />;
};

export default function JobsList() {
  const { resumeId } = useParams();
  const { token } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/jobs/by-resume/${resumeId}`, {
          headers: { Authorization: token },
        });
        setJobs(data.jobs || []);
      } catch (e) {
        console.error("Jobs error:", e.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resumeId, token]);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-[#0d1117]">
      <div className="border-b border-[#30363d] pb-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#c9d1d9]">
          Jobs for your Resume
        </h1>
        <p className="text-[#8b949e] mt-1">
          We found relevant jobs matching your skills and experience
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          {/* Animated GitHub-style loader */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-[#21262d]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#238636] animate-spin"></div>

              {/* Middle rotating ring */}
              <div className="absolute inset-2 rounded-full border-4 border-[#21262d]"></div>
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#58a6ff] animate-spin"
                style={{
                  animationDuration: "1.5s",
                  animationDirection: "reverse",
                }}
              ></div>

              {/* Inner pulsing circle */}
              <div className="absolute inset-8 rounded-full bg-[#238636] animate-pulse"></div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="size-8 text-[#c9d1d9]"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Loading text with dots animation */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">
              Finding perfect jobs for you
            </h3>
            <div className="flex items-center justify-center gap-1">
              <span className="text-[#8b949e]">Analyzing your resume</span>
              <span className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#238636] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#238636] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#238636] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-[#21262d] rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#238636] via-[#58a6ff] to-[#238636] animate-pulse"></div>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="bg-[#21262d] inline-flex rounded-lg p-4 mb-4">
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
              className="text-[#8b949e]"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-[#c9d1d9] mb-2">
            No jobs found
          </h3>
          <p className="text-[#8b949e] max-w-sm mx-auto">
            We couldn't find any jobs matching your profile at the moment.
            Please try again later or adjust your resume.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="group relative border border-[#30363d] rounded-xl p-6 bg-[#161b22] hover:border-[#238636] transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#238636]/5 via-transparent to-[#58a6ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Animated border glow */}
              <div className="absolute -inset-px bg-gradient-to-r from-[#238636]/0 via-[#238636]/50 to-[#238636]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-[#c9d1d9] group-hover:text-[#7ee787] transition-colors line-clamp-2">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 text-sm text-[#8b949e]">
                        <svg
                          className="size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"></path>
                        </svg>
                        {job.company}
                      </div>
                      {job.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#30363d]"></span>
                          <div className="flex items-center gap-1.5 text-sm text-[#8b949e]">
                            <svg
                              className="size-4"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                            {job.location}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="bg-[#238636]/10 rounded-lg p-2.5 group-hover:bg-[#238636]/20 transition-colors">
                      <PortalIcon portal={job.portal} />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#21262d] my-4"></div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {job.apply_url && (
                    <a
                      className="inline-flex items-center gap-2 text-[#c9d1d9] hover:text-white text-sm bg-[#21262d] hover:bg-[#30363d] px-4 py-2 rounded-lg transition-all font-medium border border-[#30363d] hover:border-[#58a6ff] group/btn"
                      href={job.apply_url}
                      target="_blank"
                      rel="noreferrer"
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
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Apply Now
                    </a>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/match/${resumeId}/${job.id}`, {
                        state: { job },
                      })
                    }
                    className="inline-flex items-center gap-2 text-white bg-[#238636] hover:bg-[#2ea043] px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:shadow-[#238636]/20 group/btn"
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
                      className="group-hover/btn:rotate-12 transition-transform"
                    >
                      <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                    </svg>
                    Check Match
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
