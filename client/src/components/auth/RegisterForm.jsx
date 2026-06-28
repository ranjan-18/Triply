// src/components/auth/RegisterForm.jsx

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

/**
 * Registration form component.
 * On success: stores auth tokens, updates Zustand store, redirects to /dashboard.
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/auth/register",
        formData
      );
      toast.success(response.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/auth/verify-otp",
        { email: formData.email, otp }
      );

      const { user, accessToken, refreshToken } = response.data.data;
      setAuth({ user, accessToken, refreshToken });
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <form className="space-y-5 mt-6 animate-fade-in" onSubmit={handleVerifyOtp}>
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-slate-800">{formData.email}</span>
          </p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
            className="w-full px-4 py-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition text-center tracking-widest text-lg font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify OTP →"}
        </button>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full py-2 text-sm text-slate-500 hover:text-violet-600 transition"
        >
          Change Email Address
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-5 mt-6 animate-fade-in" onSubmit={handleRegister}>
      {/* Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Full Name
        </label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Email Address
        </label>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@email.com"
            required
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Create Account →"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-violet-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;