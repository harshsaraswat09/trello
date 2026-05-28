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
import { loadDashboardData } from "../services/dashboard.live";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      try {
        setLoading(true);
        const data = await loadDashboardData();
        if (!mounted) return;
        setStats(data.stats);
        setUrgentTasks(data.urgentTasks);
        setActivities(data.activities);
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
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
        description="A focused overview of your urgent work, team movement, and fastest actions."
      />
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}
      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(loading ? [] : stats).map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </section>
      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="mb-4 text-xl font-black text-slate-950">My urgent tasks</h2>
            <TaskTable tasks={urgentTasks} />
          </section>
          <QuickActions />
        </div>
        <ActivityFeed items={activities} />
      </div>
    </DashboardLayout>
  );
}
