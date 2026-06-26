import SearchBar from "./SearchBar";
import {
  FaBell,
  FaPlus,
  FaBars,
} from "react-icons/fa";

import useAuthStore from "../../../store/authStore";
import { useNotifications } from "../../../hooks/useNotifications";
import { Link } from "react-router-dom";

const DashboardNavbar = ({
  onCreateTrip,
  onMenuClick,
}) => {
  const { user } = useAuthStore();
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      bg-white
      rounded-3xl
      mx-4
      lg:mx-6
      mt-6
      px-6
      lg:px-8
      py-6
      flex
      flex-col
      lg:flex-row
      items-start
      lg:items-center
      justify-between
      gap-4
      lg:gap-0
      shadow-sm
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
            font-bold
            text-slate-900
          "
          >
            {salutation}, {userName}! 👋
          </h1>

          <p className="text-slate-500 mt-1 text-sm lg:text-base">
            Here's what's happening with
            your trips today.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
        <SearchBar />

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
          relative
          w-12
          h-12
          rounded-xl
          border
          border-slate-200
          bg-white
          flex
          items-center
          justify-center
          hover:bg-slate-50
          transition
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

        {/* User Avatar */}
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt="Avatar" 
            className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200"
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
          "
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;