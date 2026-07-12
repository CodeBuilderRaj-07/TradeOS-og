import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "@/services/api";
import AuthLayout from "@/app/layouts/AuthLayout";
import { successToast, errorToast } from "@/services/toastService";
import { Mail, ArrowLeft, Loader2, Copy } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [devOtp, setDevOtp] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      if (res.data?.error) throw new Error(res.data.error);
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      successToast("OTP sent");
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
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp: code });
      if (res.data?.error) throw new Error(res.data.error);
      successToast("OTP verified");
      navigate(`/reset-password?token=${res.data.resetToken}`);
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Email Address
                </label>
                <div className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 focus-within:shadow-glow focus-within:border-primary/20">
                  <Mail size={18} className="shrink-0 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="you@example.com"
                    className="h-full w-full bg-transparent py-4 text-sm text-foreground outline-none"
                  />
                </div>
                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white hover:scale-[1.01] disabled:opacity-70"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Send OTP"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {devOtp && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-center">
                  <p className="text-xs text-yellow-400 mb-1">🔧 Dev mode — SMTP not configured</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-lg font-bold text-yellow-300 tracking-widest">{devOtp}</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(devOtp); successToast("Copied"); }}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              )}
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
                      className="h-14 w-12 rounded-xl border border-border bg-background/70 text-center text-xl font-bold text-foreground outline-none focus:border-primary/30 focus:shadow-glow"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otpComplete}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white hover:scale-[1.01] disabled:opacity-70"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : "Verify OTP"}
              </button>
              <div className="text-center">
                <button onClick={() => setStep("email")} className="text-xs text-muted-foreground hover:text-foreground">
                  ← Change email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
