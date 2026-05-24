import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import API from "@/services/api";

import AuthLayout
  from "@/app/layouts/AuthLayout";

import {
  successToast,
  errorToast,
} from "@/services/toastService";

import {
  setToken,
} from "@/services/tokenService";

import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function Login() {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await API.post(
            "/auth/login",
            formData
          );

        // Backend returns token string directly
        const token =
          response.data;

        if (!token) {

          throw new Error(
            "Token not received"
          );
        }

        setToken(token);

        successToast(
          "Login Successful"
        );

        navigate("/");

      } catch (error) {

        errorToast(
          error.response?.data ||
          error.message ||
          "Login Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <AuthLayout>

      <motion.div

        initial={{
          opacity: 0,
          y: 10,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.35,
        }}
      >

        {/* Heading */}
        <div className="mb-8 text-center">

          <h2 className="text-3xl font-black tracking-tight text-white">

            Welcome Back

          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-500">

            Access your professional trading workspace

          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

              Email Address

            </label>

            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 transition-all duration-300 focus-within:border-blue-500/20">

              <Mail
                size={18}
                className="text-zinc-500"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

              Password

            </label>

            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 transition-all duration-300 focus-within:border-blue-500/20">

              <Lock
                size={18}
                className="text-zinc-500"
              />

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* Forgot */}
          <div className="flex justify-end">

            <button
              type="button"
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >

              Forgot Password?

            </button>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
          >

            {loading
              ? "Signing In..."
              : "Sign In"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

        </form>

        {/* Bottom */}
        <div className="mt-8 text-center">

          <p className="text-sm text-zinc-500">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >

              Create Account

            </Link>

          </p>

        </div>

      </motion.div>

    </AuthLayout>
  );
}