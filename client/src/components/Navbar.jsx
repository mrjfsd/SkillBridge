import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  return (
    <div className="border-b border-[#30363d] bg-black">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-green-500 transition-all">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">ResumeAI</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11.5 4 13.433 5.567 15 7.5 15c1.933 0 3.5-1.567 3.5-3.5 0-1.725-1.471-3.239-2.153-3.645ZM6 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-.5 4.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0Z"></path>
            </svg>
            <span className="max-sm:hidden">{user?.name}</span>
          </div>
          <button
            onClick={logoutUser}
            className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-1.5 rounded-md active:scale-95 transition-all text-[#c9d1d9] font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path>
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
