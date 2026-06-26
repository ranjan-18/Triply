// src/pages/ComingSoonPage.jsx

import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

const ComingSoonPage = ({ title }) => {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      navbar={<DashboardNavbar />}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-4xl mb-6">
          🚀
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          This page is currently under construction. Check back later for updates!
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoonPage;
