import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "@/services/api";
import AuthLayout from "@/app/layouts/AuthLayout";
import { successToast, errorToast } from "@/services/toastService";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    try {
      setLoading(true);
      const response = await API.post("/auth/forgot-password", { email });
      if (response.data?.error) throw new Error(response.data.error);
      successToast("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      errorToast(error.response?.data?.error || error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    try {
      setLoading(true);
      const response = await API.post("/auth/verify-otp", { email, otp: code });
      const data = response.data;
      if (data.error) throw new Error(data.error);
      successToast("OTP verified");
      navigate(`/reset-password?token=${data.resetToken}`);
    } catch (error) {
      errorToast(error.response?.data?.error || error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const otpComplete = otp.every((d) => d !== "");

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            {step === "email" ? "Reset Password" : "Enter OTP"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {step === "email"
              ? "Enter your email to receive a one-time code"
              : `A 6-digit code was sent to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
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
                  "Send OTP"
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-4 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  One-Time Code
                </label>
                <div className="flex items-center justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-14 w-12 rounded-xl border border-border bg-background/70 text-center text-xl font-bold text-foreground outline-none transition-all focus:border-primary/30 focus:shadow-glow"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otpComplete}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep("email")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Change email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
