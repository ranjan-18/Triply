import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
import { useGlobalSocket } from "../hooks/useGlobalSocket";
import CreateTripModal from "../components/dashboard/modals/CreateTripModal";
import JoinTripModal from "../components/dashboard/modals/JoinTripModal";

const DashboardLayout = ({
  children,
  sidebar,
  navbar,
}) => {
  useGlobalSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCreateTrip, setOpenCreateTrip] = useState(false);
  const [openJoinTrip, setOpenJoinTrip] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState("");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("joinCode");
    if (code) {
      setInitialJoinCode(code);
      setOpenJoinTrip(true);
      // Remove the query param so it doesn't re-trigger on reload
      searchParams.delete("joinCode");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#f7f4ff] flex relative overflow-x-hidden">
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
          <navbar.type {...navbar.props} onMenuClick={() => setIsSidebarOpen(true)} onCreateTrip={() => setOpenCreateTrip(true)} onJoinTrip={() => setOpenJoinTrip(true)} />
        ) : (
          <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} onCreateTrip={() => setOpenCreateTrip(true)} onJoinTrip={() => setOpenJoinTrip(true)} />
        )}

        <main className="p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      <CreateTripModal isOpen={openCreateTrip} onClose={() => setOpenCreateTrip(false)} />
      <JoinTripModal isOpen={openJoinTrip} onClose={() => { setOpenJoinTrip(false); setInitialJoinCode(""); }} initialCode={initialJoinCode} />
    </div>
  );
};

export default DashboardLayout;