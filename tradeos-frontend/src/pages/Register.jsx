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
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function Register() {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      fullName: "",
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

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await API.post(
          "/auth/register",
          formData
        );

        successToast(
          "Account created successfully"
        );

        setTimeout(() => {

          navigate("/login");

        }, 1200);

      } catch (error) {

        errorToast(
          error.message ||
          "Registration failed"
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

            Create Account

          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-500">

            Start building your professional trading journey

          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* Full Name */}
          <div>

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

              Full Name

            </label>

            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 transition-all duration-300 focus-within:border-blue-500/20">

              <User
                size={18}
                className="text-zinc-500"
              />

              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

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
                placeholder="Create a secure password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

        </form>

        {/* Bottom */}
        <div className="mt-8 text-center">

          <p className="text-sm text-zinc-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >

              Sign In

            </Link>

          </p>

        </div>

      </motion.div>

    </AuthLayout>
  );
}