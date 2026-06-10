import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0d1117] overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-[#238636] opacity-10 blur-[120px] rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-[#8957e5] opacity-10 blur-[140px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gradient-to-br from-[#161b22] to-[#0d1117] border-2 border-[#30363d] rounded-2xl px-6 sm:px-8 py-8 sm:py-10 shadow-2xl overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#238636]/5 via-transparent to-[#8957e5]/5 opacity-50"></div>

          {/* Header */}
          <div className="relative mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7ee787] via-[#58a6ff] to-[#b392f0] bg-clip-text text-transparent">
              {state === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-[#8b949e] text-sm mt-2">
              {state === "login"
                ? "Sign in to your account"
                : "Sign up to get started"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="relative space-y-3 sm:space-y-4">
            {state !== "login" && (
              <div className="group">
                <label className="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 sm:left-4 text-[#6e7681] group-focus-within:text-[#58a6ff] transition-colors">
                    <User2Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-[#0d1117] border-2 border-[#30363d] rounded-lg text-sm sm:text-base text-[#c9d1d9] placeholder-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 outline-none transition-all"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 sm:left-4 text-[#6e7681] group-focus-within:text-[#238636] transition-colors">
                  <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-[#0d1117] border-2 border-[#30363d] rounded-lg text-sm sm:text-base text-[#c9d1d9] placeholder-[#6e7681] focus:border-[#238636] focus:ring-2 focus:ring-[#238636]/20 outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-medium text-[#8b949e] mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 sm:left-4 text-[#6e7681] group-focus-within:text-[#8957e5] transition-colors">
                  <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-[#0d1117] border-2 border-[#30363d] rounded-lg text-sm sm:text-base text-[#c9d1d9] placeholder-[#6e7681] focus:border-[#8957e5] focus:ring-2 focus:ring-[#8957e5]/20 outline-none transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {state === "login" && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  className="text-xs sm:text-sm text-[#58a6ff] hover:text-[#7ee787] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="relative w-full h-11 sm:h-12 mt-4 sm:mt-6 rounded-lg bg-gradient-to-r from-[#238636] to-[#2ea043] text-white text-sm sm:text-base font-medium shadow-lg hover:from-[#2ea043] hover:to-[#238636] transition-all transform hover:scale-[1.02] active:scale-95 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {state === "login" ? "Sign in" : "Create account"}
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#30363d]"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-[#161b22] text-[#6e7681]">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-[#8b949e] text-xs sm:text-sm">
              {state === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  setState((prev) => (prev === "login" ? "register" : "login"))
                }
                className="text-[#58a6ff] hover:text-[#7ee787] font-medium hover:underline transition-colors"
              >
                {state === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#238636]/20 to-transparent rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-[#8957e5]/20 to-transparent rounded-tr-full opacity-50"></div>
        </form>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-[#6e7681] text-xs sm:text-sm px-2">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#58a6ff] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#58a6ff] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
