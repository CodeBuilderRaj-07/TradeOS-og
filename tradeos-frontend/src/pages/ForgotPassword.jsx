import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "@/services/api";
import AuthLayout from "@/app/layouts/AuthLayout";
import { successToast, errorToast } from "@/services/toastService";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      successToast("Reset link sent if this email exists");
    } catch (error) {
      errorToast(error.response?.data?.error || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {sent ? "Check your email for the reset link" : "Enter your email to receive a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-success/20 bg-success/5 p-6 text-center">
              <CheckCircle size={40} className="mx-auto text-success mb-3" />
              <p className="text-sm font-medium text-foreground">
                If an account exists with that email, we've sent a password reset link.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Check your inbox and spam folder. The link expires in 15 minutes.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition-all duration-300 hover:bg-sidebar-accent"
            >
              Send again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Email Address
              </label>
              <div className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 transition-all duration-300 focus-within:shadow-glow focus-within:border-primary/20">
                <Mail size={18} className="shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                  placeholder="you@example.com"
                  className="h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Sending...</>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
