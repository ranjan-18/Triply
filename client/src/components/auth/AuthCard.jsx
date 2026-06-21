const AuthCard = ({
  children,
}) => {
  return (
    <div
      className="
      flex
      items-center
      justify-center
      p-8
      bg-white
    "
    >
      <div
        className="
        w-full
        max-w-lg
      "
      >
        {children}
      </div>
    </div>
  );
};

export default AuthCard;