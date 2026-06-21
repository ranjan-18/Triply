import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [isLoading, setIsLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

      localStorage.setItem(
        "accessToken",
        response.data.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );

      toast.success(
        response.data.message ||
          "Login successful 🎉"
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Email Address
        </label>

        <div className="relative">
          <FaEnvelope
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@email.com"
            required
            className="
              w-full
              pl-12
              pr-4
              py-4
              border
              border-slate-200
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <button
            type="button"
            className="
              text-sm
              text-violet-600
              hover:underline
            "
          >
            Forgot Password?
          </button>
        </div>

        <div className="relative">
          <FaLock
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="
              w-full
              pl-12
              pr-12
              py-4
              border
              border-slate-200
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-violet-600
              transition
            "
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full
          py-4
          rounded-xl
          bg-gradient-to-r
          from-violet-600
          to-purple-500
          text-white
          font-semibold
          shadow-lg
          hover:opacity-90
          transition
          disabled:opacity-50
        "
      >
        {isLoading
          ? "Signing In..."
          : "Sign In →"}
      </button>
    </form>
  );
};

export default LoginForm;