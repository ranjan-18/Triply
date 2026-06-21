import AuthLayout from "../components/auth/AuthLayout";
import AuthHero from "../components/auth/AuthHero";
import AuthCard from "../components/auth/AuthCard";

import AuthTabs from "../components/auth/AuthTabs";
import LoginForm from "../components/auth/LoginForm";
import SocialLogin from "../components/auth/SocialLogin";
import AuthFooter from "../components/auth/AuthFooter";

const LoginPage = () => {
  return (
    <AuthLayout
      left={<AuthHero />}
      right={
        <AuthCard>
          <div className="max-w-md mx-auto">
            {/* Welcome Badge */}
            <p className="text-violet-600 font-medium mb-3">
              👋 Welcome Back!
            </p>

            {/* Heading */}
            <h1 className="text-5xl font-bold text-slate-900">
              Sign in
            </h1>

            <p className="mt-3 text-slate-500">
              Access your trips and expenses.
            </p>

            {/* Tabs */}
            <div className="mt-8">
              <AuthTabs />
            </div>

            {/* Form */}
            <LoginForm />

            {/* Social Login */}
            

            {/* Footer */}
            <AuthFooter />
          </div>
        </AuthCard>
      }
    />
  );
};

export default LoginPage;