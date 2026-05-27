import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout, PageHeader } from "../components/DashboardComponents";
import { createWorkspace } from "../services/dashboard.api";

export default function NewWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await createWorkspace({ name });
      navigate("/workspaces");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create workspace");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Create"
        title="Create Workspace"
        description="Create a backend workspace for boards, lists, and cards."
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label className="text-sm font-black text-slate-700">
          Workspace name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            placeholder="ERP Development"
            required
          />
        </label>
        {error && <p className="mt-4 text-sm font-bold text-rose-600">{error}</p>}
        <button
          disabled={saving}
          className="mt-5 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </DashboardLayout>
  );
}
