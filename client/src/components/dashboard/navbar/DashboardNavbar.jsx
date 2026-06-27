
import {
  FaBell,
  FaPlus,
  FaBars,
} from "react-icons/fa";

import { useState, useRef, useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import { useNotifications } from "../../../hooks/useNotifications";
import { Link, useNavigate } from "react-router-dom";

const DashboardNavbar = ({
  onCreateTrip,
  onMenuClick,
}) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userName =
    user?.name || "Ranjan";

  const initials =
    userName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RK";

  const hour = new Date().getHours();
  let salutation = "Good Evening";
  if (hour >= 5 && hour < 12) salutation = "Good Morning";
  else if (hour >= 12 && hour < 18) salutation = "Good Afternoon";

  return (
    <div
      className="
      bg-gradient-to-br from-white to-violet-50/50
      backdrop-blur-xl border border-white
      rounded-[32px]
      mx-4
      lg:mx-6
      mt-6
      p-6
      lg:p-8
      flex
      flex-col
      lg:flex-row
      items-start
      lg:items-center
      justify-between
      gap-6
      lg:gap-0
      shadow-[0_20px_50px_rgba(124,58,237,0.05)]
    "
    >
      {/* Left */}
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <button 
          onClick={onMenuClick}
          className="lg:hidden w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
        >
          <FaBars size={20} />
        </button>
        <div>
          <h1
            className="
            text-2xl
            lg:text-3xl
            font-extrabold
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-slate-900
            to-slate-700
            tracking-tight
          "
          >
            {salutation}, {userName}! <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h1>

          <p className="text-slate-500 mt-1 text-sm lg:text-base">
            Here's what's happening with
            your trips today.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-between gap-4 w-full lg:w-auto mt-4 lg:mt-0">
        {/* Create Trip */}
        <button
          onClick={onCreateTrip}
          className="
          flex
          items-center
          gap-3
          bg-gradient-to-r
          from-violet-600
          to-purple-500
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
          shadow-lg
          hover:scale-105
          transition
        "
        >
          <FaPlus />

          Create Trip
        </button>

        {/* Notifications */}
        <Link
          to="/dashboard/notifications"
          className="
          hidden lg:flex
          relative
          w-12
          h-12
          rounded-2xl
          border
          border-slate-200/60
          bg-white/80
          backdrop-blur-md
          items-center
          justify-center
          hover:bg-slate-50
          transition
          shadow-sm
        "
        >
          <FaBell className="text-slate-600" />

          {unreadCount > 0 && (
            <span className="
            absolute
            -top-1
            -right-1
            min-w-5
            h-5
            px-1
            bg-red-500
            text-white
            text-xs
            rounded-full
            flex
            items-center
            justify-center
          "
          >
            {unreadCount}
          </span>
          )}
        </Link>

        {/* User Avatar & Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center focus:outline-none hover:opacity-80 transition"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-14 h-14 rounded-full object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-4 ring-white"
              />
            ) : (
              <div
                className="
                w-14
                h-14
                rounded-full
                bg-violet-100
                flex
                items-center
                justify-center
                font-bold
                text-violet-600
                text-lg
                ring-4
                ring-white
              "
              >
                {initials}
              </div>
            )}
          </button>

          {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in-up origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50 rounded-t-xl -mt-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Ranjan Kumar"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    clearAuth();
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;