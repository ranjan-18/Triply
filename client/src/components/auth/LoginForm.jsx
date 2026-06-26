// src/components/auth/LoginForm.jsx

import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

/**
 * Login form component.
 * On success: stores auth tokens in Zustand store (persisted to localStorage) and redirects to /dashboard.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { user, accessToken, refreshToken } = response.data.data;

      // Persist in Zustand (written through to localStorage via persist middleware)
      setAuth({ user, accessToken, refreshToken });

      toast.success(response.data.message || "Login successful! 🎉");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
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
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <button type="button" className="text-sm text-violet-600 hover:underline">
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
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
        {isLoading ? "Signing In..." : "Sign In →"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/" className="text-violet-600 font-medium hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;