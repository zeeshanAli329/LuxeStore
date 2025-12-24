"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../../store";
import { login as apiLogin } from "../../services/authService";
import api from "../../lib/api";
import { API_BASE } from "../../lib/config";
import { FormSkeleton } from "@/components/ui/Skeletons";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [diagResult, setDiagResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useStore();

  const showDebug = searchParams.get("debugApi") === "1";

  useEffect(() => {
    if (showDebug) {
      console.log("--- API DIAGNOSTICS MODE ---");
    }
  }, [showDebug]);

  const testConnection = async () => {
    setTesting(true);
    setDiagResult(null);
    try {
      const res = await api.get("/health");
      setDiagResult({ success: true, data: res.data });
    } catch (err) {
      setDiagResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const next = searchParams.get("next");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await apiLogin({ email, password });
      login(data.user, data.token);
      if (data.user.role === "admin") {
        router.replace(next && next.startsWith("/admin") ? next : "/admin");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {showDebug && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-xs font-mono">
            <button onClick={testConnection} disabled={testing} className="bg-blue-600 text-white px-2 py-1 cursor-pointer rounded">
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <input
              type="email"
              required
              className="relative block w-full rounded-t-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 px-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="password"
              required
              className="relative block w-full rounded-b-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 px-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-center text-sm">
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><FormSkeleton /></div>}>
      <LoginForm />
    </Suspense>
  );
}
