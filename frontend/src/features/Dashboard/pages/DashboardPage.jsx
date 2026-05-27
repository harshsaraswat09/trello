import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ActivityFeed,
  DashboardLayout,
  PageHeader,
  QuickActions,
  StatCard,
  TaskTable,
} from "../components/DashboardComponents";
import { activities, quickActions, stats as fallbackStats, tasks } from "../data/dashboardData";
import { getBoardsByWorkspace, getWorkspaces } from "../services/dashboard.api";
import { toWorkspaceCard } from "../services/dashboard.transforms";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(fallbackStats);
  const [source, setSource] = useState("demo");
  const urgentTasks = tasks.filter((task) =>
    ["High", "Overdue"].includes(task.priority) || task.status === "Overdue"
  );

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      try {
        const workspaceData = await getWorkspaces();
        const mappedWorkspaces = workspaceData.map(toWorkspaceCard);
        const boardGroups = await Promise.all(
          mappedWorkspaces.map((workspace) => getBoardsByWorkspace(workspace.id))
        );
        const totalBoards = boardGroups.flat().length;

        if (mounted && mappedWorkspaces.length > 0) {
          setStats([
            {
              label: "Total Workspaces",
              count: String(mappedWorkspaces.length),
              trend: "Loaded from API",
              icon: "WS",
            },
            {
              label: "Active Boards",
              count: String(totalBoards),
              trend: "Loaded from API",
              icon: "BD",
            },
            fallbackStats[2],
            fallbackStats[3],
          ]);
          setSource("live");
        }
      } catch (error) {
        console.warn("Using demo dashboard overview because API request failed:", error.message);
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name || "Workflow User"}`}
        description={`${source === "live" ? "Live workspace and board counts" : "Demo fallback overview"} · A focused overview of your urgent work, team movement, and fastest actions.`}
      />
      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </section>
      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="mb-4 text-xl font-black text-slate-950">
              My urgent tasks
            </h2>
            <TaskTable tasks={urgentTasks} />
          </section>
          <QuickActions items={quickActions} />
        </div>
        <ActivityFeed items={activities.slice(0, 4)} />
      </div>
    </DashboardLayout>
  );
}
