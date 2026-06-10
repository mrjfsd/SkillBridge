const CallToAction = () => {
  return (
    <div id="cta" className="w-full bg-[#0d1117] py-20 px-4 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] p-8 md:p-12 shadow-xl">
          {/* Gradient Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#238636] opacity-5 blur-3xl rounded-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#238636] opacity-5 blur-3xl rounded-full -z-10"></div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Left Side - Text Content */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#238636]/10 border border-[#238636]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7ee787]"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <span className="text-xs font-medium text-[#7ee787]">
                    Ready to get started?
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#c9d1d9] leading-tight">
                  Build a Professional Resume That Helps You Stand Out
                </h2>
              </div>
              <p className="text-[#8b949e] text-lg leading-relaxed">
                Join thousands of job seekers who've successfully landed their
                dream positions using our AI-powered resume builder. Create,
                customize, and optimize your resume in minutes.
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#7ee787]">
                    10K+
                  </span>
                  <span className="text-sm text-[#8b949e]">
                    Resumes Created
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#7ee787]">95%</span>
                  <span className="text-sm text-[#8b949e]">Success Rate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#7ee787]">
                    24/7
                  </span>
                  <span className="text-sm text-[#8b949e]">AI Support</span>
                </div>
              </div>
            </div>

            {/* Right Side - CTA Buttons & Visual */}
            <div className="flex flex-col gap-4">
              {/* Primary CTA Button */}
              <a
                href="/app"
                className="group flex items-center justify-center gap-3 rounded-lg py-4 px-8 bg-[#238636] hover:bg-[#2ea043] active:scale-95 transition-all text-white font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <span>Get Started Now</span>
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
                  className="size-5 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>

              {/* Secondary CTA Button */}
              <button className="flex items-center justify-center gap-2 rounded-lg py-4 px-8 border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] active:scale-95 transition-all text-[#c9d1d9] font-semibold shadow-md hover:shadow-lg">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                <span>Watch Demo</span>
              </button>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-200">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100"
                    alt="user"
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
                    alt="user"
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100"
                    alt="user"
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    Trusted by professionals
                  </span>
                  <span className="text-xs text-gray-600">
                    From startups to Fortune 500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent"></div>
        </div>

        {/* Feature Highlights Below CTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
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
                className="text-green-600"
              >
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                AI-Powered
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Smart suggestions to improve your resume
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
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
                className="text-green-600"
              >
                <path d="M9 12l2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                ATS Optimized
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Pass applicant tracking systems
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
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
                className="text-green-600"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                24/7 Support
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Always here to help you succeed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
