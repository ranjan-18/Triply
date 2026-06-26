import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthLayout = ({ left, right }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenLogin = () => {
    navigate("/login");
    setIsMobileModalOpen(true);
  };

  const handleOpenRegister = () => {
    navigate("/");
    setIsMobileModalOpen(true);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[52%_48%] relative">
      {/* Left side: Hero Image. Always visible on desktop. On mobile, it's the main screen. */}
      <div className="relative w-full min-h-screen lg:min-h-0 flex flex-col">
        {left}
        
        {/* Mobile Action Buttons */}
        <div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col gap-4 lg:hidden z-20 animate-fade-in-up delay-400">
          <button 
            onClick={handleOpenLogin} 
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-lg shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgb(124,58,237,0.5)] transition-all hover:-translate-y-1"
          >
            Sign In
          </button>
          <button 
            onClick={handleOpenRegister} 
            className="w-full py-4 rounded-2xl bg-white/90 backdrop-blur-md text-violet-600 font-bold text-lg shadow-xl hover:bg-white transition-all hover:-translate-y-1"
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Right side: Form (Desktop always visible) */}
      <div className="hidden lg:block h-full">
        {right}
      </div>

      {/* Mobile Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
            onClick={() => setIsMobileModalOpen(false)} 
          />
          <div 
            className="relative w-full bg-white/95 backdrop-blur-xl rounded-t-[36px] max-h-[90vh] overflow-y-auto shadow-2xl pb-6 transition-transform transform translate-y-0 border-t border-white/20"
            style={{ animation: 'springUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-10 pt-6 pb-2 px-6 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4"></div>
              <button 
                onClick={() => setIsMobileModalOpen(false)} 
                className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            {/* The right component contains AuthCard which has p-8, so it formats nicely */}
            <div className="-mt-4">
              {right}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes springUp {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;