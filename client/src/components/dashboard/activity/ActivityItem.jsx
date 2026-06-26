// src/components/dashboard/activity/ActivityItem.jsx

import {
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const ActivityItem = ({
  user,
  action,
  amount,
  positive,
  time,
}) => {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      py-4
      border-b
      border-slate-100
    "
    >
      <div className="flex gap-4">
        <div
          className="
          w-12
          h-12
          rounded-full
          bg-violet-100
          flex
          items-center
          justify-center
          font-bold
          text-violet-600
        "
        >
          {user[0]}
        </div>

        <div>
          <h4 className="font-medium">
            {user}
          </h4>

          <p className="text-sm text-slate-500">
            {action}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {time}
          </p>
        </div>
      </div>

      <div
        className={`
          flex
          items-center
          gap-2
          font-bold
          ${
            positive
              ? "text-green-500"
              : "text-red-500"
          }
        `}
      >
        {positive ? (
          <FaArrowUp />
        ) : (
          <FaArrowDown />
        )}

        ₹{amount}
      </div>
    </div>
  );
};

export default ActivityItem;