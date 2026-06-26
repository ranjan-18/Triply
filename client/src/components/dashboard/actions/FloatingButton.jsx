import { FaPlus } from "react-icons/fa";

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
      fixed
      bottom-8
      right-8
      w-16
      h-16
      rounded-full
      bg-gradient-to-r
      from-violet-600
      to-purple-500
      text-white
      shadow-2xl
      hover:scale-110
      transition
      z-50
    "
    >
      <FaPlus className="mx-auto" />
    </button>
  );
};

export default FloatingButton;