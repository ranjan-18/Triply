import { FaGithub, FaGoogle } from "react-icons/fa";

const SocialLogin = () => {
  return (
    <>
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-slate-200" />

        <span className="px-4 text-slate-400 text-sm">
          or continue with
        </span>

        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="
            border
            rounded-xl
            py-4
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <FaGoogle />
          Google
        </button>

        <button
          type="button"
          className="
            border
            rounded-xl
            py-4
            flex
            items-center
            justify-center
            gap-3
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