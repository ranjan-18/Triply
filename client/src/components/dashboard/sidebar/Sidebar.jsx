import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarProfile from "./SidebarProfile";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ onClose }) => {
  return (
    <aside
      className="
      w-[280px]
      bg-white
      border-r
      border-slate-100
      flex
      flex-col
      justify-between
      min-h-screen
    "
    >
      <div className="relative">
        <SidebarHeader />
        
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-4 lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <FaTimes />
          </button>
        )}

        <SidebarMenu />
      </div>

      <SidebarProfile />
    </aside>
  );
};

export default Sidebar;