import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BoardCard,
  DashboardLayout,
  PageHeader,
} from "../components/DashboardComponents";
import { loadDashboardData } from "../services/dashboard.live";

export default function BoardsPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("All workspaces");
  const [loading, setLoading] = useState(true);

  const filteredBoards = useMemo(() => {
    if (selectedWorkspace === "All workspaces") return boards;
    return boards.filter((board) => board.workspace === selectedWorkspace);
  }, [boards, selectedWorkspace]);

  useEffect(() => {
    let mounted = true;

    async function loadBoards() {
      try {
        const data = await loadDashboardData();
        if (!mounted) return;
        setWorkspaces(data.workspaces);
        setBoards(data.boards);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBoards();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Boards"
        title="Boards"
        description="Track all active boards across your WorkflowOS workspaces."
        action={
          <Link
            to="/boards/new"
            className="inline-flex rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Create Board
          </Link>
        }
      />
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm font-black text-slate-700" htmlFor="workspace-filter">
          Filter by workspace
        </label>
        <select
          id="workspace-filter"
          value={selectedWorkspace}
          onChange={(event) => setSelectedWorkspace(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 sm:max-w-sm"
        >
          <option>All workspaces</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id}>{workspace.name}</option>
          ))}
        </select>
      </div>
      {loading && (
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          Loading boards from backend...
        </div>
      )}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredBoards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </section>
    </DashboardLayout>
  );
}
