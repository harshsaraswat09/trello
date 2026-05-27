import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout, PageHeader } from "../components/DashboardComponents";
import { createBoard, getWorkspaces } from "../services/dashboard.api";
import { toWorkspaceCard } from "../services/dashboard.transforms";

export default function NewBoardPage() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("workspace");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadWorkspaces() {
      try {
        const data = await getWorkspaces();
        const mapped = data.map(toWorkspaceCard);

        if (mounted) {
          setWorkspaces(mapped);
          setWorkspaceId(mapped[0]?.id || "");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Create a workspace before creating a board");
      }
    }

    loadWorkspaces();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const board = await createBoard(workspaceId, { title, visibility });
      navigate(`/boards/${board._id || board.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create board");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Create"
        title="Create Board"
        description="Create a backend board inside one of your workspaces."
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label className="block text-sm font-black text-slate-700">
          Workspace
          <select
            value={workspaceId}
            onChange={(event) => setWorkspaceId(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            required
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-black text-slate-700">
          Board title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            placeholder="ERP Task Management"
            required
          />
        </label>
        <label className="block text-sm font-black text-slate-700">
          Visibility
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            <option value="workspace">Workspace</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>
        {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
        <button
          disabled={saving || !workspaceId}
          className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Board"}
        </button>
      </form>
    </DashboardLayout>
  );
}
