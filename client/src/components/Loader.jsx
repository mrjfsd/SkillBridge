import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0d1117]">
      {/* Enhanced GitHub-style loader */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-[#21262d]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#238636] animate-spin"></div>

          {/* Middle rotating ring */}
          <div className="absolute inset-2 rounded-full border-4 border-[#21262d]"></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#58a6ff] animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] animate-pulse shadow-lg shadow-[#238636]/50"></div>

          {/* Center GitHub icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="size-8 text-[#c9d1d9] animate-pulse"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Loading text with dots animation */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">Loading</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-[#8b949e] text-sm">Please wait</span>
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
        <div
          className="h-full bg-gradient-to-r from-[#238636] via-[#58a6ff] to-[#238636] animate-pulse"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
