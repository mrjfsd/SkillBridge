import Title from "./title";

const Features = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center py-20 bg-[#0d1117] scroll-mt-12"
    >
      <div className="flex items-center gap-2 text-sm text-[#7ee787] bg-[#238636]/10 rounded-full px-6 py-1.5 border border-[#238636] font-medium">
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
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span>Features</span>
      </div>

      <Title
        title="Build your resume"
        description="Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mt-12">
        {/* Card 1 - AI-Powered Resume Writing */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#238636] transition-all duration-300 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#238636]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Glow effect on hover */}
          <div className="absolute -inset-px bg-gradient-to-r from-[#238636]/0 via-[#238636]/50 to-[#238636]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            {/* Icon container with gradient and shadow */}
            <div className="relative bg-gradient-to-br from-[#238636]/20 to-[#238636]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#238636]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#7ee787] relative z-10"
              >
                <path d="M9.31 9.31 5 21l11.69-4.31M9.31 9.31 3 3l18 18M9.31 9.31 16 2l-4.31 11.69" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#7ee787] transition-colors">
              AI-Powered Resume Writing
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Get intelligent suggestions and improvements for your resume
              content using advanced AI technology.
            </p>

            {/* Decorative line */}
            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#238636] to-[#2ea043] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* Card 2 - Professional Templates */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#58a6ff]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-[#58a6ff]/0 via-[#58a6ff]/50 to-[#58a6ff]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            <div className="relative bg-gradient-to-br from-[#58a6ff]/20 to-[#58a6ff]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#58a6ff]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#58a6ff] relative z-10"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8" />
                <path d="M14 10h4" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#58a6ff] transition-colors">
              Professional Templates
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Choose from a variety of modern, ATS-friendly resume templates
              designed for success.
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* Card 3 - Job Matching */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#f778ba] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f778ba]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-[#f778ba]/0 via-[#f778ba]/50 to-[#f778ba]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            <div className="relative bg-gradient-to-br from-[#f778ba]/20 to-[#f778ba]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#f778ba]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#f778ba] relative z-10"
              >
                <path d="m22 8-6 4 6 4V8Z" />
                <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#f778ba] transition-colors">
              Job Matching
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Find the perfect job opportunities that match your skills and
              experience automatically.
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#f778ba] to-[#db61a2] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* Card 4 - ATS Optimization */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#ffa657] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffa657]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-[#ffa657]/0 via-[#ffa657]/50 to-[#ffa657]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            <div className="relative bg-gradient-to-br from-[#ffa657]/20 to-[#ffa657]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#ffa657]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#ffa657] relative z-10"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#ffa657] transition-colors">
              ATS Optimization
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Ensure your resume gets past Applicant Tracking Systems with our
              optimized formatting.
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#ffa657] to-[#f0883e] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* Card 5 - Skill Recommendations */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#bc8cff] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bc8cff]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-[#bc8cff]/0 via-[#bc8cff]/50 to-[#bc8cff]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            <div className="relative bg-gradient-to-br from-[#bc8cff]/20 to-[#bc8cff]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#bc8cff]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#bc8cff] relative z-10"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#bc8cff] transition-colors">
              Skill Recommendations
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Get personalized skill suggestions based on your industry and
              target job positions.
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#bc8cff] to-[#d2a8ff] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>

        {/* Card 6 - Export Options */}
        <div className="group relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#7ee787] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7ee787]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-[#7ee787]/0 via-[#7ee787]/50 to-[#7ee787]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur -z-10"></div>

          <div className="relative z-10">
            <div className="relative bg-gradient-to-br from-[#7ee787]/20 to-[#7ee787]/5 rounded-xl p-4 w-fit mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#7ee787]/10 rounded-xl blur-xl"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#7ee787] relative z-10"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="M8 15h8" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#c9d1d9] mb-3 group-hover:text-[#7ee787] transition-colors">
              Export Options
            </h3>
            <p className="text-[#8b949e] leading-relaxed">
              Download your resume in multiple formats including PDF, DOCX, and
              more.
            </p>

            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#7ee787] to-[#56d364] group-hover:w-full transition-all duration-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
