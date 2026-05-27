import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DashboardLayout,
  PageHeader,
  WorkspaceCard,
} from "../components/DashboardComponents";
import { workspaces as fallbackWorkspaces } from "../data/dashboardData";
import { getWorkspaces } from "../services/dashboard.api";
import { toWorkspaceCard } from "../services/dashboard.transforms";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState(fallbackWorkspaces);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("demo");

  useEffect(() => {
    let mounted = true;

    async function loadWorkspaces() {
      try {
        const data = await getWorkspaces();
        const mapped = data.map(toWorkspaceCard);

        if (mounted && mapped.length > 0) {
          setWorkspaces(mapped);
          setSource("live");
        }
      } catch (error) {
        console.warn("Using demo workspaces because API request failed:", error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWorkspaces();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspaces"
        title="Workspaces"
        description={`${source === "live" ? "Live backend data" : "Demo fallback data"} · Group boards, people, and delivery processes by team, department, or client.`}
        action={
          <Link
            to="/workspaces/new"
            className="inline-flex rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Create Workspace
          </Link>
        }
      />
      {loading && (
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          Loading workspaces from backend...
        </div>
      )}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </section>
    </DashboardLayout>
  );
}
