"use client";

import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  message: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    // /health is on the root, not under /api
    const healthUrl = apiUrl.replace(/\/api\/?$/, "") + "/health";

    fetch(healthUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Logo */}
      <div className="mb-8">
        <svg
          width="102"
          height="32"
          viewBox="0 0 102 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M51 1C42.75 1 36 7.75 36 16C36 24.25 42.75 31 51 31C59.25 31 66 24.25 66 16C66 7.75 59.25 1 51 1Z"
            fill="#FF385C"
          />
          <text
            x="51"
            y="21"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
          >
            air
          </text>
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-gray-600">
        Airbnb Clone
      </h1>
      <p className="text-gray-400 mb-10 text-lg">
        Full-Stack Health Check
      </p>

      {/* Health Check Card */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-600">
          Backend Connection
        </h2>

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-airbnb rounded-full animate-spin" />
            <span className="text-gray-400">Connecting to backend...</span>
          </div>
        )}

        {health && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="font-medium text-success">Connected</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-500">
              <p>
                <span className="text-gray-400">status:</span>{" "}
                {health.status}
              </p>
              <p>
                <span className="text-gray-400">message:</span>{" "}
                {health.message}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-error" />
              <span className="font-medium text-error">
                Connection Failed
              </span>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-sm text-error">
              <p>{error}</p>
              <p className="mt-2 text-gray-400">
                Make sure the backend is running on port 8000.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tech Stack Info */}
      <div className="mt-10 grid grid-cols-2 gap-4 text-center text-sm text-gray-400">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="font-semibold text-gray-500">Frontend</p>
          <p>Next.js + TypeScript + Tailwind</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="font-semibold text-gray-500">Backend</p>
          <p>FastAPI + SQLAlchemy + SQLite</p>
        </div>
      </div>
    </main>
  );
}
