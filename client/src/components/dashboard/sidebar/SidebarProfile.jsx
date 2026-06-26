// src/components/dashboard/sidebar/SidebarProfile.jsx

import { useState } from "react";
import { FaSignOutAlt, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";

/**
 * Sidebar footer component — shows logged-in user profile and logout button.
 */
const SidebarProfile = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axiosInstance.post("/auth/logout");
    } catch {
      // Logout locally even if server call fails
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-11 h-11 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              {initials}
            </div>
          )}

          <div className="overflow-hidden">
            <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[100px]">
              {user?.name || "User"}
            </h4>
            <p className="text-xs text-slate-400 truncate max-w-[100px]">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
          className="w-9 h-9 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile;