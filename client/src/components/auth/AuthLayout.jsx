const AuthLayout = ({ left, right }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-[52%_48%]">
      {left}
      {right}
    </div>
  );
};

export default AuthLayout;