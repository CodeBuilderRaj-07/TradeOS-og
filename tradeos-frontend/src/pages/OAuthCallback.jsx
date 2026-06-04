import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "@/services/api";
import { setToken, setUser, setRole } from "@/services/tokenService";
import { useAuthStore } from "@/store/authStore";
import { successToast, errorToast } from "@/services/toastService";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const state = searchParams.get("state");
    const savedState = sessionStorage.getItem("oauth_state");
    sessionStorage.removeItem("oauth_state");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (!code) {
      setError("No authorization code received");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (state && savedState && state !== savedState) {
      setError("State mismatch. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const completeLogin = async () => {
      try {
        const response = await API.post("/auth/oauth/google", { code });
        const data = response.data;

        if (data.error) throw new Error(data.error);

        const token = data.token;
        const userData = data.user;
        if (!token) throw new Error("No token received from server");

        setToken(token);
        if (userData) {
          setUser(userData);
          setRole(userData.role || "TRADER");
          login({ user: userData, token });
        }

        successToast("Signed in with Google");
        navigate("/");
      } catch (err) {
        errorToast(err.response?.data?.error || err.message || "OAuth login failed");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    completeLogin();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Completing sign in...</p>
        </div>
      )}
    </div>
  );
}
