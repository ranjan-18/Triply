const variants = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-700",

  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200",

  danger:
    "bg-red-500 text-white hover:bg-red-600",

  ghost:
    "bg-transparent hover:bg-slate-100",
};

/**
 * Reusable Button
 */

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        px-4
        py-2
        rounded-xl
        font-medium
        transition-all
        duration-200
        cursor-pointer
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;