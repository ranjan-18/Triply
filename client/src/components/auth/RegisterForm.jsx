import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
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
          "http://localhost:5000/api/auth/register",
          formData
        );

      toast.success(
        response.data.message ||
          "Account created successfully 🎉"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Registration failed"
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
      {/* Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Full Name
        </label>

        <div className="relative">
          <FaUser
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
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
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Password
        </label>

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
          ? "Creating Account..."
          : "Create Account →"}
      </button>
    </form>
  );
};

export default RegisterForm;