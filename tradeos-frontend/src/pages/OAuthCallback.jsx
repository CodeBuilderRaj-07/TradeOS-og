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
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (!token) {
      setError("No authentication token received");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const completeLogin = async () => {
      try {
        setToken(token);
        const response = await API.get("/auth/profile");
        const userData = response.data;

        if (userData.error) throw new Error(userData.error);

        setUser(userData);
        setRole(userData.role || "TRADER");
        login({ user: userData, token });
        successToast("Signed in with Google");
        navigate("/");
      } catch (err) {
        errorToast(err.message || "OAuth login failed");
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
