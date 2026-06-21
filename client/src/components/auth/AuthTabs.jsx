import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const AuthTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <div
      className="
        flex
        p-1
        bg-slate-100
        rounded-2xl
        mb-6
      "
    >
      <button
        type="button"
        onClick={() =>
          navigate("/login")
        }
        className={`
          flex-1
          py-3
          rounded-xl
          text-center
          font-medium
          transition-all
          duration-300
          ${
            !isRegister
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          }
        `}
      >
        Sign In
      </button>

      <button
        type="button"
        onClick={() =>
          navigate("/")
        }
        className={`
          flex-1
          py-3
          rounded-xl
          text-center
          font-medium
          transition-all
          duration-300
          ${
            isRegister
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          }
        `}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;