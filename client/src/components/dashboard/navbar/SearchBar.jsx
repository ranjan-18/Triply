import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="relative">
      <FaSearch
        className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-slate-400
      "
      />

      <input
        type="text"
        placeholder="Search trips, expenses, people..."
        className="
          w-[340px]
          py-3
          pl-12
          pr-4
          rounded-xl
          border
          border-slate-200
          outline-none
          focus:ring-2
          focus:ring-violet-500
        "
      />
    </div>
  );
};

export default SearchBar;