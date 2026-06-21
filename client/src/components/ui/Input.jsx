/**
 * Reusable Input
 */

const Input = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="
            block
            text-sm
            font-medium
            text-slate-700
          "
        >
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-slate-300
          outline-none
          focus:ring-2
          focus:ring-violet-500
          focus:border-transparent
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;