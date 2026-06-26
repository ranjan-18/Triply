// src/components/dashboard/sidebar/SidebarMenu.jsx

import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSuitcase,
  FaReceipt,
  FaExchangeAlt,
  FaUserFriends,
  FaChartBar,
  FaBell,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  {
    icon: <FaHome />,
    label: "Overview",
    path: "/dashboard",
  },
  {
    icon: <FaSuitcase />,
    label: "My Trips",
    path: "/dashboard/trips",
  },
  {
    icon: <FaReceipt />,
    label: "Expenses",
    path: "/dashboard/expenses", // or whatever the route is
  },
  {
    icon: <FaExchangeAlt />,
    label: "Settlements",
    path: "/dashboard/settlements",
  },
  {
    icon: <FaUserFriends />,
    label: "Friends",
    path: "/dashboard/friends",
  },
  {
    icon: <FaChartBar />,
    label: "Reports",
    path: "/dashboard/reports",
  },
  {
    icon: <FaBell />,
    label: "Notifications",
    path: "/dashboard/notifications",
    hasDynamicBadge: true,
  },
  {
    icon: <FaCog />,
    label: "Settings",
    path: "/dashboard/settings",
  },
];

import { useNotifications } from "../../../hooks/useNotifications";

const SidebarMenu = () => {
  const location = useLocation();
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="px-4 mt-4">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

          const badgeValue = item.hasDynamicBadge && unreadCount > 0 ? unreadCount : item.badge;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-xl
                transition
                ${
                  isActive
                    ? "bg-violet-100 text-violet-600"
                    : "hover:bg-slate-50 text-slate-600"
                }
              `}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span>{item.label}</span>
              </div>

              {badgeValue && (
                <span
                  className="
                  w-6
                  h-6
                  rounded-full
                  bg-violet-500
                  text-white
                  text-xs
                  flex
                  items-center
                  justify-center
                "
                >
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenu;