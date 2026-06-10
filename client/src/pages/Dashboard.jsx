// PATH: resume-builder/client/src/pages/Dashboard.jsx
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import api from "../configs/api";

export default function Dashboard() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const colors = ["#a78bfa", "#fcd34d", "#f87171", "#38bdf8", "#34d399"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [token]);

  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreate(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(file);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } }
      );
      setTitle("");
      setFile(null);
      setShowUpload(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
    setIsLoading(false);
  };

  const updateTitle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editId, resumeData: { title } },
        { headers: { Authorization: token } }
      );
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editId ? { ...r, title } : r))
      );
      setTitle("");
      setEditId("");
      toast.success(data.message || "Updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      const { data } = await api.delete(`/api/resumes/delete/${id}`, {
        headers: { Authorization: token },
      });
      setAllResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success(data.message || "Deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      {/* Animated Background Effects */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#238636] opacity-5 blur-[120px] rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#8957e5] opacity-5 blur-[140px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#58a6ff] opacity-3 blur-[160px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section with stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7ee787] via-[#58a6ff] to-[#b392f0] bg-clip-text text-transparent mb-2">
                My Resumes
              </h1>
              <p className="text-[#8b949e] text-lg">
                Create, manage, and optimize your professional resumes
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg">
                <div className="text-2xl font-bold text-[#7ee787]">
                  {allResumes.length}
                </div>
                <div className="text-xs text-[#8b949e]">Total Resumes</div>
              </div>
              <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg">
                <div className="text-2xl font-bold text-[#58a6ff]">
                  {
                    allResumes.filter(
                      (r) =>
                        new Date(r.updatedAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-xs text-[#8b949e]">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top actions with enhanced design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mb-12">
          <button
            onClick={() => setShowCreate(true)}
            className="group relative w-full bg-gradient-to-br from-[#161b22] to-[#0d1117] h-56 flex flex-col items-center justify-center rounded-2xl gap-4 border-2 border-[#30363d] hover:border-[#238636] hover:shadow-2xl hover:shadow-[#238636]/30 transition-all overflow-hidden transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#238636]/10 via-[#238636]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#238636] blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <PlusIcon className="size-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#c9d1d9] mb-2 group-hover:text-[#7ee787] transition-colors">
                  Create Resume
                </p>
                <p className="text-sm text-[#8b949e]">
                  Start from scratch with AI assistance
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="group relative w-full bg-gradient-to-br from-[#161b22] to-[#0d1117] h-56 flex flex-col items-center justify-center rounded-2xl gap-4 border-2 border-[#30363d] hover:border-[#8957e5] hover:shadow-2xl hover:shadow-[#8957e5]/30 transition-all overflow-hidden transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8957e5]/10 via-[#8957e5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-[#8957e5] blur-xl opacity-50 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div className="relative p-4 bg-gradient-to-br from-[#8957e5] to-[#b392f0] rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <UploadCloudIcon
                    className="size-10 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#c9d1d9] mb-2 group-hover:text-[#b392f0] transition-colors">
                  Upload Resume
                </p>
                <p className="text-sm text-[#8b949e]">
                  Import existing PDF with AI parsing
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#21262d]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#0d1117] text-sm text-[#8b949e]">
              Your Resumes
            </span>
          </div>
        </div>

        {/* Resume cards with enhanced design */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allResumes.map((r, idx) => (
            <div
              key={r._id}
              className="group relative rounded-2xl border-2 border-[#30363d] overflow-hidden bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#238636] hover:shadow-2xl hover:shadow-[#238636]/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at top right, ${
                    colors[idx % colors.length]
                  }15, transparent 70%)`,
                }}
              ></div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

              {/* Header with icon */}
              <div className="relative px-5 py-5 border-b border-[#21262d]">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div
                      className="absolute inset-0 blur-lg opacity-50"
                      style={{ background: colors[idx % colors.length] }}
                    ></div>
                    <div
                      className="relative p-3 rounded-xl shadow-xl transform group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${
                          colors[idx % colors.length]
                        }, ${colors[idx % colors.length]}cc)`,
                      }}
                    >
                      <FilePenLineIcon
                        className="size-6 text-white"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-[#c9d1d9] truncate group-hover:text-[#7ee787] transition-colors">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#8b949e] flex items-center gap-1">
                        <svg
                          className="size-3"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                        </svg>
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: `${colors[idx % colors.length]}22`,
                          color: colors[idx % colors.length],
                          boxShadow: `0 0 10px ${
                            colors[idx % colors.length]
                          }33`,
                        }}
                      >
                        ● Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="relative px-5 py-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/app/builder/${r._id}`)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#238636] hover:text-[#7ee787] transition-all shadow-sm hover:shadow-md"
                    title="Edit resume"
                  >
                    <PencilIcon className="size-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${r._id}`)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#238636] to-[#2ea043] text-white hover:from-[#2ea043] hover:to-[#238636] transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    title="Find jobs"
                  >
                    <svg
                      className="size-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                    </svg>
                    FindJobs
                  </button>
                  <button
                    onClick={() => {
                      setEditId(r._id);
                      setTitle(r.title);
                    }}
                    className="flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all shadow-sm hover:shadow-md"
                    title="Rename"
                  >
                    <svg
                      className="size-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z" />
                    </svg>
                    Rename
                  </button>
                  <button
                    onClick={() => deleteResume(r._id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border border-[#da3633]/50 bg-[#da3633]/10 text-[#f85149] hover:bg-[#da3633]/20 hover:border-[#f85149] transition-all shadow-sm hover:shadow-md"
                    title="Delete"
                  >
                    <TrashIcon className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Animated border glow */}
            </div>
          ))}

          {allResumes.length === 0 && (
            <div className="col-span-full">
              <div className="relative rounded-2xl border-2 border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                <div className="relative max-w-md mx-auto">
                  <div className="mb-6 inline-flex p-5 rounded-2xl bg-gradient-to-br from-[#238636]/20 to-[#238636]/5 relative">
                    <div className="absolute inset-0 bg-[#238636] blur-2xl opacity-30 animate-pulse"></div>
                    <FilePenLineIcon
                      className="relative size-12 text-[#7ee787]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#c9d1d9] mb-3">
                    No resumes yet
                  </h3>
                  <p className="text-[#8b949e] mb-8 text-lg">
                    Create your first resume or upload an existing one to get
                    started with your job search journey.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCreate(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#238636] transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Create Resume
                    </button>
                    <button
                      onClick={() => setShowUpload(true)}
                      className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-md hover:bg-[#21262d] transition-all"
                    >
                      Upload Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreate(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#238636]/10 rounded-lg">
                <PlusIcon className="size-5 text-[#7ee787]" />
              </div>
              <h2 className="text-xl font-bold text-[#c9d1d9]">
                Create New Resume
              </h2>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#8b949e] mb-2">
                Resume Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all"
                placeholder="e.g., Software Engineer Resume"
                required
              />
            </div>
            <button className="w-full py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all font-medium shadow-lg hover:shadow-xl">
              Create Resume
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setTitle("");
              }}
              className="absolute top-4 right-4 p-1 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-all"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </form>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUpload(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#8957e5]/10 rounded-lg">
                <UploadCloudIcon className="size-5 text-[#b392f0]" />
              </div>
              <h2 className="text-xl font-bold text-[#c9d1d9]">
                Upload Resume
              </h2>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8b949e] mb-2">
                Resume Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#8957e5] focus:border-transparent outline-none transition-all"
                placeholder="e.g., My Professional Resume"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#8b949e] mb-2">
                Resume File (PDF)
              </label>
              <label
                htmlFor="file-input"
                className="flex flex-col items-center gap-3 border-2 border-dashed border-[#30363d] rounded-lg p-8 text-[#8b949e] hover:border-[#8957e5] hover:bg-[#8957e5]/5 cursor-pointer transition-all group"
              >
                {file ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-8 text-[#7ee787]"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[#c9d1d9] font-medium">{file.name}</p>
                      <p className="text-xs text-[#8b949e]">
                        Click to change file
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-[#8957e5]/10 rounded-lg group-hover:bg-[#8957e5]/20 transition-colors">
                      <UploadCloud className="size-8 text-[#b392f0]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[#c9d1d9] font-medium mb-1">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-[#6e7681]">or drag and drop</p>
                    </div>
                  </>
                )}
              </label>
              <input
                type="file"
                id="file-input"
                accept=".pdf"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <button
              disabled={isLoading}
              className="w-full py-3 bg-[#8957e5] text-white rounded-lg hover:bg-[#9e6de5] transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
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
                  <span>Uploading...</span>
                </>
              ) : (
                "Upload Resume"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUpload(false);
                setTitle("");
                setFile(null);
              }}
              className="absolute top-4 right-4 p-1 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-all"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </form>
      )}

      {/* Rename Modal */}
      {editId && (
        <form
          onSubmit={updateTitle}
          onClick={() => setEditId("")}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#58a6ff]/10 rounded-lg">
                <svg
                  className="size-5 text-[#58a6ff]"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#c9d1d9]">
                Edit Resume Title
              </h2>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#8b949e] mb-2">
                Resume Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent outline-none transition-all"
                placeholder="Enter resume title"
                required
              />
            </div>
            <button className="w-full py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all font-medium shadow-lg hover:shadow-xl">
              Update Title
            </button>
            <button
              type="button"
              onClick={() => {
                setEditId("");
                setTitle("");
              }}
              className="absolute top-4 right-4 p-1 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-all"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
