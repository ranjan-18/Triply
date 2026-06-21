const AuthFooter = () => {
  return (
    <p
      className="
      mt-8
      text-center
      text-sm
      text-slate-500
    "
    >
      By signing up you agree to our{" "}
      <span className="text-violet-600 cursor-pointer">
        Terms of Service
      </span>{" "}
      and{" "}
      <span className="text-violet-600 cursor-pointer">
        Privacy Policy
      </span>
    </p>
  );
};

export default AuthFooter;