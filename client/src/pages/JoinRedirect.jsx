import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const JoinRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // If logged in, go to dashboard and pass the code
      navigate(`/dashboard?joinCode=${code}`);
    } else {
      // If not logged in, go to login and pass the code so we can handle it later if needed
      // (For now just redirecting to login is fine, they can paste it later)
      navigate(`/login`);
    }
  }, [code, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
  );
};

export default JoinRedirect;
