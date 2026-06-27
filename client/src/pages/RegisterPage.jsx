// Removed AuthLayout and AuthHero imports
import AuthCard from "../components/auth/AuthCard";
import AuthTabs from "../components/auth/AuthTabs";
import RegisterForm from "../components/auth/RegisterForm";
import SocialLogin from "../components/auth/SocialLogin";
import AuthFooter from "../components/auth/AuthFooter";

const RegisterPage = () => {
  return (
    <AuthCard>
      <div className="max-w-md mx-auto">
        <p className="text-violet-600 font-medium">
          🎉 Welcome to Triply!
        </p>

        <h1 className="text-3xl font-bold">
          Create your account
        </h1>

        <p className="mt-2 text-slate-500">
          Already have an account?
          <span className="ml-2 text-violet-600 cursor-pointer">
            Sign in instead
          </span>
        </p>

        <div className="mt-4">
          <AuthTabs />
        </div>

        <RegisterForm />

    

        <AuthFooter />
      </div>
    </AuthCard>
  );
};

export default RegisterPage;