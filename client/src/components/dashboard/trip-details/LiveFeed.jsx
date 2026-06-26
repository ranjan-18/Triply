// src/components/dashboard/trip-details/LiveFeed.jsx

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { initSocket, getSocket } from "../../../socket/socketClient";
import { useActivities } from "../../../hooks/useActivities";
import useAuthStore from "../../../store/authStore";

const LiveFeed = ({ tripId }) => {
  const { token } = useAuthStore();
  const { data: initialActivities = [], isLoading } = useActivities(tripId);
  const queryClient = useQueryClient();
  
  const [newActivities, setNewActivities] = useState([]);
  const feed = [...newActivities, ...initialActivities];

  // Setup socket
  useEffect(() => {
    if (!token) return;

    const socket = initSocket(token);
    
    socket.emit("join_trip", tripId);

    // When a new activity occurs, prepend it to the feed
    socket.on("NEW_ACTIVITY", (activity) => {
      setNewActivities((prev) => [activity, ...prev]);
    });

    // General trip update triggers React Query refetches automatically
    socket.on("TRIP_UPDATED", () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
      queryClient.invalidateQueries({ queryKey: ["balances", tripId] });
      queryClient.invalidateQueries({ queryKey: ["settlements", tripId] });
      queryClient.invalidateQueries({ queryKey: ["optimizedSettlements", tripId] });
    });

    return () => {
      socket.emit("leave_trip", tripId);
      socket.off("NEW_ACTIVITY");
      socket.off("TRIP_UPDATED");
    };
  }, [tripId, token, queryClient]);

  if (isLoading) {
    return <div className="p-6 border rounded-[32px] bg-slate-50 h-[400px] animate-pulse"></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col h-full max-h-[500px]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        <h3 className="font-bold text-xl text-slate-800">Live Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {feed.length === 0 ? (
          <p className="text-sm text-slate-500 text-center mt-10">No activity yet. Add an expense!</p>
        ) : (
          feed.map((activity, idx) => (
            <div key={activity._id || idx} className="flex gap-3 text-sm">
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-violet-700 font-bold text-xs mt-1">
                {activity.userId?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p>
                  <span className="font-semibold text-slate-800">{activity.userId?.name}</span>{" "}
                  <span className="text-slate-600">{activity.message}</span>
                </p>
                <span className="text-xs text-slate-400">
                  {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
