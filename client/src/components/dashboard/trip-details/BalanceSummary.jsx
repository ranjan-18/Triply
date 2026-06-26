// src/components/dashboard/trip-details/BalanceSummary.jsx

import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { useBalances } from "../../../hooks/useBalances";

/**
 * Displays the net balance of each member for a trip.
 * Green = user is owed money, Red = user owes money, Grey = settled.
 *
 * @param {{ tripId: string }} props
 */
const BalanceSummary = ({ tripId }) => {
  const { data: balances = [], isLoading, isError } = useBalances(tripId);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || balances.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {balances.map((balance) => {
        const isPositive = balance.netBalance > 0;
        const isNeutral = balance.netBalance === 0;

        return (
          <div
            key={balance.userId}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
          >
            {/* Member info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-sm">
                {balance.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-slate-800">{balance.name}</h3>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isNeutral
                    ? "bg-slate-100 text-slate-400"
                    : isPositive
                    ? "bg-emerald-100 text-emerald-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {isNeutral ? (
                  <FaMinus className="text-xs" />
                ) : isPositive ? (
                  <FaArrowUp className="text-xs" />
                ) : (
                  <FaArrowDown className="text-xs" />
                )}
              </div>

              <div>
                <p
                  className={`text-2xl font-bold ${
                    isNeutral
                      ? "text-slate-400"
                      : isPositive
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  ₹{Math.abs(balance.netBalance).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">
                  {isNeutral
                    ? "Settled up"
                    : isPositive
                    ? "Gets back"
                    : "Owes"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BalanceSummary;
