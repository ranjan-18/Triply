// src/pages/dashboard/NotificationsPage.jsx

import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaBell, FaCheckDouble, FaCircle } from "react-icons/fa";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../../hooks/useNotifications";
import moment from "moment";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Inbox</h1>
            <p className="text-slate-500 mt-2 text-lg">Stay updated with your trips and friends</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              <FaCheckDouble /> Mark all as read
            </button>
            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-3xl relative">
              <FaBell />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-10 space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-20 text-center">
              <FaBell className="text-6xl text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">You're all caught up!</h3>
              <p className="text-slate-500">No new notifications to show right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(notification => (
                <div 
                  key={notification._id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 flex items-start gap-5 transition ${notification.isRead ? "bg-white hover:bg-slate-50 opacity-70" : "bg-blue-50/30 hover:bg-blue-50/60 cursor-pointer"}`}
                >
                  <div className="mt-1">
                    {!notification.isRead && <FaCircle className="text-blue-600 text-xs shadow-[0_0_8px_rgba(37,99,235,0.6)] rounded-full" />}
                  </div>
                  
                  {notification.senderId?.avatar ? (
                    <img src={notification.senderId.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center font-bold text-blue-700">
                      {notification.senderId?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">
                      {notification.message}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {moment(notification.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
