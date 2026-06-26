// src/components/dashboard/expenses/ExpenseFilters.jsx

import { FaFilter } from "react-icons/fa";

const CATEGORIES = ["All", "Food", "Transport", "Stay", "Other"];

/**
 * Filter bar for expense lists.
 * Calls onFilterChange(category) when user selects a category.
 *
 * @param {{ activeFilter: string, onFilterChange: Function }} props
 */
const ExpenseFilters = ({ activeFilter = "All", onFilterChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-slate-400 text-sm mr-1">
        <FaFilter className="text-xs" />
        <span>Filter:</span>
      </div>

      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange?.(category)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            activeFilter === category
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ExpenseFilters;
