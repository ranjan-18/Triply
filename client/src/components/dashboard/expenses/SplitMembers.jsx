// src/components/dashboard/expenses/SplitMembers.jsx

/**
 * Displays member split breakdown for a given expense.
 *
 * @param {{ splits: Array, paidBy: Object }} props
 */
const SplitMembers = ({ splits = [], paidBy }) => {
  if (!splits || splits.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">
        Split Details
      </p>

      <div className="space-y-2">
        {splits.map((split, index) => {
          const userId =
            split.userId?._id?.toString() ?? split.userId?.toString();
          const isPayer =
            paidBy?._id?.toString() === userId ||
            paidBy?.toString() === userId;

          return (
            <div
              key={userId || index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
                  {split.userId?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <span className="text-sm text-slate-700">
                  {split.userId?.name || "Member"}
                </span>
                {isPayer && (
                  <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
                    Paid
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                ₹{split.owedAmount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplitMembers;
