import { useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
import { useGlobalSocket } from "../hooks/useGlobalSocket";

const DashboardLayout = ({
  children,
  sidebar,
  navbar,
}) => {
  useGlobalSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f4ff] flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebar ? (
          <sidebar.type {...sidebar.props} onClose={() => setIsSidebarOpen(false)} />
        ) : (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </div>

      <div className="flex-1 flex flex-col w-full lg:w-[calc(100%-280px)] min-w-0">
        {navbar ? (
          <navbar.type {...navbar.props} onMenuClick={() => setIsSidebarOpen(true)} />
        ) : (
          <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        )}

        <main className="p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;