import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "@/services/api";
import AuthLayout from "@/app/layouts/AuthLayout";
import { successToast, errorToast, infoToast } from "@/services/toastService";
import { API_BASE_URL } from "@/app/config/constants";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({ fullName: "", email: "", password: "" });
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false });

  const validateField = (name, value) => {
    if (!value.trim()) {
      const labels = { fullName: "Full name", email: "Email", password: "Password" };
      return `${labels[name]} is required`;
    }
    if (name === "email" && !EMAIL_REGEX.test(value)) return "Enter a valid email address";
    if (name === "password" && value.length < 6) return "Password must be at least 6 characters";
    if (name === "fullName" && value.trim().length < 2) return "Enter your full name";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isValid = () => {
    const nameErr = validateField("fullName", formData.fullName);
    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);
    setErrors({ fullName: nameErr, email: emailErr, password: passErr });
    setTouched({ fullName: true, email: true, password: true });
    return !nameErr && !emailErr && !passErr;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      successToast("Account created successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      errorToast(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `flex h-13 items-center gap-3 rounded-2xl border bg-background/70 px-4 transition-all duration-300 focus-within:shadow-glow ${
      errors[field] && touched[field]
        ? "border-destructive/40 focus-within:border-destructive/40"
        : touched[field] && !errors[field]
          ? "border-success/30 focus-within:border-success/30"
          : "border-border focus-within:border-primary/20"
    }`;

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Create Account
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Start building your professional trading journey
          </p>
        </div>

        {/* Social Register */}
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => window.location.href = API_BASE_URL.replace("/api", "") + "/oauth2/authorization/google"}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-3 text-xs font-semibold text-muted-foreground transition hover:bg-background/80 hover:text-foreground disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => infoToast("GitHub sign up coming soon")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-3 text-xs font-semibold text-muted-foreground transition hover:bg-background/80 hover:text-foreground disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card/90 px-3 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Full Name
            </label>
            <div className={inputClass("fullName")}>
              <User size={18} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className="h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            {errors.fullName && touched.fullName && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-destructive/80"
              >
                {errors.fullName}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Email Address
            </label>
            <div className={inputClass("email")}>
              <Mail size={18} className="shrink-0 text-muted-foreground" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className="h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            {errors.email && touched.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-destructive/80"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <div className={inputClass("password")}>
              <Lock size={18} className="shrink-0 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a secure password"
                className="h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="shrink-0 text-muted-foreground transition hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-destructive/80"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Bottom */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
