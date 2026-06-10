import {
  BriefcaseBusiness,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import React from "react";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
    },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#c9d1d9]">
        Personal Information
      </h3>
      <p className="text-sm text-[#8b949e]">
        Get started with your personal information
      </p>
      <div className="flex items-center gap-4">
        <label className="relative group">
          {data.image ? (
            <div className="relative">
              <img
                src={
                  typeof data.image === "string"
                    ? data.image
                    : URL.createObjectURL(data.image)
                }
                alt="user-image"
                className="w-16 h-16 rounded-full object-cover mt-5 border-2 border-[#30363d] hover:border-[#58a6ff] transition-colors"
              />
              <div className="absolute inset-0 mt-5 rounded-full bg-[#0d1117]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  className="text-[#c9d1d9]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 mt-5 text-[#8b949e] hover:text-[#58a6ff] cursor-pointer transition-colors group">
              <div className="p-2.5 border border-[#30363d] rounded-full group-hover:border-[#58a6ff] transition-colors">
                <User className="size-10 p-2.5" />
              </div>
              <span>Upload image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>
        {typeof data.image === "object" && (
          <div className="flex flex-col gap-2 pl-4 text-sm mt-5">
            <p className="text-[#c9d1d9]">Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer text-[#c9d1d9] gap-3">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />
              <div className="w-11 h-6 bg-[#21262d] rounded-full peer peer-checked:bg-[#238636] transition-colors duration-200">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-[#c9d1d9] rounded-full transition-transform duration-200 ease-in-out ${
                    removeBackground ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        )}
      </div>

      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="mt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-[#8b949e] mb-1.5">
              <Icon className="size-4" />
              {field.label}
              {field.required && <span className="text-[#f85149]">*</span>}
            </label>
            <div className="relative">
              <input
                type={field.type}
                value={data[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:ring-1 focus:ring-[#238636] focus:border-[#238636] outline-none transition-colors text-[#c9d1d9] text-sm placeholder:text-[#484f58]"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
              />
              <div className="absolute inset-0 rounded-md pointer-events-none transition-opacity opacity-0 focus-within:opacity-100">
                <div className="absolute inset-[-2px] rounded-lg bg-gradient-to-r from-[#238636]/50 to-[#2ea043]/50 blur"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;
