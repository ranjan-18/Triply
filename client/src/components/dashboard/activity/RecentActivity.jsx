import { FaArrowUp, FaArrowDown, FaReceipt } from "react-icons/fa";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSettlements } from "../../../hooks/useSettlements";
import moment from "moment";
import { Link } from "react-router-dom";

const RecentActivity = ({ tripId }) => {
  const { data: expenses = [] } = useExpenses(tripId, { enabled: !!tripId });
  const { data: settlements = [] } = useSettlements(tripId, { enabled: !!tripId });

  // Combine and format
  const combined = [];

  expenses.forEach(ex => {
    combined.push({
      id: `ex_${ex._id}`,
      user: ex.paidBy?.name || "Someone",
      avatar: ex.paidBy?.avatar,
      action: `Added ${ex.category || 'expense'}`,
      amount: ex.amount,
      positive: false,
      time: ex.createdAt,
    });
  });

  settlements.forEach(set => {
    combined.push({
      id: `set_${set._id}`,
      user: set.paidBy?.name || "Someone",
      avatar: set.paidBy?.avatar,
      action: "Settled payment",
      amount: set.amount,
      positive: true,
      time: set.createdAt,
    });
  });

  // Sort by newest first
  combined.sort((a, b) => new Date(b.time) - new Date(a.time));
  const recentActivities = combined.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        {tripId && (
          <Link to={`/dashboard/trips/${tripId}`} className="text-violet-600 font-medium hover:underline">
            View All
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FaReceipt className="text-4xl text-slate-200 mx-auto mb-2" />
            <p>No recent activity found.</p>
          </div>
        ) : (
          recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-none last:pb-0"
            >
              <div className="flex gap-4 items-center">
                {activity.avatar ? (
                  <img src={activity.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-slate-800">{activity.user}</h4>
                  <p className="text-sm text-slate-500">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-1">{moment(activity.time).fromNow()}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-1 font-bold ${
                  activity.positive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {activity.positive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                ₹{activity.amount.toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;