"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../../store";
import { login as apiLogin } from "../../services/authService";
import api from "../../lib/api";
import { API_BASE } from "../../lib/config";
import { useEffect } from "react";

// Separate component to safely use useSearchParams inside Suspense boundary
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [diagResult, setDiagResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useStore();

  const showDebug = searchParams.get("debugApi") === "1";

  useEffect(() => {
    if (showDebug) {
      console.log("--- API DIAGNOSTICS MODE ---");
      console.log("Origin:", typeof window !== "undefined" ? window.location.origin : "N/A");
      console.log("API_BASE:", API_BASE);
      console.log("Env Value:", process.env.NEXT_PUBLIC_API_BASE_URL);
    }
  }, [showDebug]);

  const testConnection = async () => {
    setTesting(true);
    setDiagResult(null);
    try {
      const res = await api.get("/health");
      setDiagResult({ success: true, data: res.data });
    } catch (err) {
      setDiagResult({
        success: false,
        error: err.message,
        details: err.config ? {
          baseURL: err.config.baseURL,
          url: err.config.url,
          method: err.config.method
        } : "Config missing"
      });
    } finally {
      setTesting(false);
    }
  };

  const next = searchParams.get("next");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    try {
      console.log(`[Login] Attempting sign-in for: ${email}`);
      const data = await apiLogin({ email, password });

      // 1. Update global store
      login(data.user, data.token);

      // 2. Strict Redirect Logic
      if (data.user.role === "admin") {
        router.replace(next && next.startsWith("/admin") ? next : "/admin");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (!err.response) {
        // Network error - Most common on mobile if URL is wrong or proxy fails
        setError("Connectivity Error. Please check your internet or try again later.");
        console.error("Network Error Details:", {
          baseURL: err.config?.baseURL,
          url: err.config?.url
        });
      } else {
        // Server responded with error (e.g. 401 Unauthorized)
        setError(err.response.data?.message || "Invalid email or password.");
      }
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
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-xs font-mono space-y-2">
            <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-1">API DIAGNOSTICS</h3>
            <p><strong>Configured Base:</strong> <span className="text-blue-600">{API_BASE || "UNDEFINED"}</span></p>
            <p><strong>Full Login Path:</strong> <span className="text-gray-600">{API_BASE}/users/login</span></p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={testConnection}
                disabled={testing}
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {testing ? "Testing..." : "Test /health Connection"}
              </button>
            </div>
            {diagResult && (
              <pre className={`mt-2 p-2 rounded overflow-auto max-h-40 ${diagResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {JSON.stringify(diagResult, null, 2)}
              </pre>
            )}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
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
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
