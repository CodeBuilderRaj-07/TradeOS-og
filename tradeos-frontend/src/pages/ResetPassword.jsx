import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "@/services/api";
import AuthLayout from "@/app/layouts/AuthLayout";
import { successToast, errorToast } from "@/services/toastService";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!token) errors.token = "Missing reset token";
    if (newPassword.length < 6) errors.newPassword = "At least 6 characters";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });
      const data = response.data;

      if (data.error) throw new Error(data.error);

      successToast("Password reset successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      errorToast(error.response?.data?.error || error.message || "Failed to reset password");
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
            Set New Password
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              New Password
            </label>
            <div className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 focus-within:shadow-glow focus-within:border-primary/20">
              <Lock size={18} className="shrink-0 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); if (fieldErrors.newPassword) setFieldErrors({ ...fieldErrors, newPassword: "" }); }}
                  placeholder="New password"
                  className={`h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground ${fieldErrors.newPassword ? "text-red-400" : ""}`}
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
              {fieldErrors.newPassword && <p className="mt-1 text-xs text-red-400">{fieldErrors.newPassword}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Confirm Password
              </label>
              <div className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 focus-within:shadow-glow focus-within:border-primary/20">
                <Lock size={18} className="shrink-0 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" }); }}
                  placeholder="Confirm new password"
                  className={`h-full w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground ${fieldErrors.confirmPassword ? "text-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="shrink-0 text-muted-foreground transition hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>}
            </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

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
