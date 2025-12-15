// frontend/src/components/admin/AdminDashboard.tsx
// EMERGENCY SIMPLE VERSION (PRODUCTION-SAFE)
// - Uses NEXT_PUBLIC_API_URL instead of hardcoded localhost
// - ESLint-safe (no unused vars, no explicit any)
// - Stable hooks (useCallback + proper dependencies)
// - Better error handling (checks response.ok + safe JSON access)

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Applicant {
  _id: string;
  studentName: string;
  program: string;
  outcome: string;
  ruleSummary: string;
  sessionId: string;
  createdAt: string;
  gpa?: number;
}

type ApplicantsApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    applicants?: Applicant[];
  };
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unexpected error";
};

export default function AdminDashboard() {
  const API_BASE_URL = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return raw.replace(/\/$/, "");
  }, []);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplicants = useCallback(async () => {
    try {
      console.log("Loading applicants...");
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/admin/applicants`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // If backend returns HTML error page or non-JSON, this prevents crashing
      let json: ApplicantsApiResponse | null = null;
      try {
        json = (await response.json()) as ApplicantsApiResponse;
      } catch {
        json = null;
      }

      if (!response.ok) {
        const msg =
          json?.message ||
          `Failed to load applicants (HTTP ${response.status})`;
        console.error("Applicants fetch failed:", msg);
        toast.error(msg);
        setApplicants([]);
        return;
      }

      const list = json?.data?.applicants ?? [];
      console.log("Applicants:", list);

      setApplicants(list);
    } catch (err: unknown) {
      console.error("Error:", err);
      toast.error(getErrorMessage(err) || "Failed to load");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const handleDelete = useCallback(
    async (sessionId: string) => {
      if (!confirm("Delete this applicant?")) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/applicants/${encodeURIComponent(sessionId)}`,
          { method: "DELETE" }
        );

        let json: { success?: boolean; message?: string } | null = null;
        try {
          json = (await response.json()) as { success?: boolean; message?: string };
        } catch {
          json = null;
        }

        if (!response.ok || json?.success === false) {
          const msg =
            json?.message ||
            `Delete failed (HTTP ${response.status})`;
          toast.error(msg);
          return;
        }

        toast.success("Deleted");
        await loadApplicants();
      } catch (err: unknown) {
        toast.error(getErrorMessage(err) || "Delete failed");
      }
    },
    [API_BASE_URL, loadApplicants]
  );

  const handleView = useCallback((sessionId: string) => {
    // Using toast instead of alert (cleaner + non-blocking)
    toast(`Session: ${sessionId}`, { duration: 4000 });
  }, []);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  console.log("RENDER - Applicants:", applicants, "Count:", applicants.length);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard (Simple Test)
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Applicants</h2>
          <button
            onClick={loadApplicants}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm">
            <strong>Debug Info:</strong>
          </p>
          <p className="text-sm">API Base: {API_BASE_URL}</p>
          <p className="text-sm">Loading: {loading ? "YES" : "NO"}</p>
          <p className="text-sm">Count: {applicants.length}</p>
          <p className="text-sm">Type: {typeof applicants}</p>
          <p className="text-sm">
            Is Array: {Array.isArray(applicants) ? "YES" : "NO"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applicants found
          </div>
        ) : (
          <div className="space-y-2">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="border rounded p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{app.studentName}</div>
                    <div className="text-sm text-gray-600">
                      {app.program} • {app.outcome}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {app.ruleSummary}
                    </div>
                    {typeof app.gpa === "number" && (
                      <div className="text-sm text-gray-600 mt-1">
                        GPA: {app.gpa}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(app.sessionId)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.sessionId)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This is a simplified production-safe test version.
          It uses <code>NEXT_PUBLIC_API_URL</code> and falls back to localhost only for local dev.
        </p>
      </div>
    </div>
  );
}
