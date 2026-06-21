import { FaGithub, FaGoogle } from "react-icons/fa";

const SocialLogin = () => {
  return (
    <>
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-slate-200" />

        <span className="px-4 text-sm text-slate-400">
          or continue with
        </span>

        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="
            border
            border-slate-200
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            hover:bg-slate-50
          "
        >
          <FaGoogle />
          Google
        </button>

        <button
          type="button"
          className="
            border
            border-slate-200
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            hover:bg-slate-50
          "
        >
          <FaGithub />
          GitHub
        </button>
      </div>
    </>
  );
};

export default SocialLogin;