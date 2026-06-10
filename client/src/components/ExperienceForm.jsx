import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const generateDescription = async (index) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`;

    try {
      const { data } = await api.post(
        "api/ai/enhance-job-desc",
        { userContent: prompt },
        { headers: { Authorization: token } }
      );
      updateExperience(index, "description", data.enhancedContent);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#c9d1d9]">
            <Briefcase className="size-5 text-[#7ee787]" />
            Professional Experience
          </h3>
          <p className="text-sm text-[#8b949e]">Add your job experience</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
          <div className="inline-flex p-4 rounded-full bg-[#238636]/10 mb-4">
            <Briefcase className="w-8 h-8 text-[#7ee787]" />
          </div>
          <p className="text-[#c9d1d9] font-medium mb-1">
            No work experience added yet
          </p>
          <p className="text-sm text-[#8b949e]">
            Click "Add Experience" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-5 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-4 hover:border-[#238636]/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-[#c9d1d9] font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#238636]/20 text-[#7ee787] text-xs font-bold">
                    {index + 1}
                  </span>
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-[#f85149] hover:text-[#ff7b72] hover:bg-[#da3633]/10 p-2 rounded-md transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-4 py-2.5 text-sm bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all"
                />

                <input
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-4 py-2.5 text-sm bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all"
                />

                <input
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  type="month"
                  className="px-4 py-2.5 text-sm bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all"
                />

                <input
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  type="month"
                  disabled={experience.is_current}
                  className="px-4 py-2.5 text-sm bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all disabled:bg-[#0d1117] disabled:opacity-50"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) => {
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false
                    );
                  }}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#238636] focus:ring-2 focus:ring-[#238636] focus:ring-offset-0 focus:ring-offset-[#0d1117] cursor-pointer"
                />
                <span className="text-sm text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#8b949e]">
                    Job Description
                  </label>
                  <button
                    onClick={() => generateDescription(index)}
                    disabled={
                      generatingIndex === index ||
                      !experience.position ||
                      !experience.company
                    }
                    className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#8957e5] hover:bg-[#9e6de5] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:ring-2 focus:ring-[#238636] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
