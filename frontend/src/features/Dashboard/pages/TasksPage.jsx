import { useEffect, useMemo, useState } from "react";
import {
  DashboardLayout,
  PageHeader,
  TaskTable,
} from "../components/DashboardComponents";
import { loadDashboardData } from "../services/dashboard.live";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [boardFilter, setBoardFilter] = useState("All");

  useEffect(() => {
    let mounted = true;

    async function loadTasks() {
      try {
        const data = await loadDashboardData();
        if (mounted) setTasks(data.tasks);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      mounted = false;
    };
  }, []);

  const boardOptions = useMemo(
    () => ["All", ...Array.from(new Set(tasks.map((task) => task.board)))],
    [tasks]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const statusOk = statusFilter === "All" || task.status === statusFilter;
        const priorityOk = priorityFilter === "All" || task.priority === priorityFilter;
        const boardOk = boardFilter === "All" || task.board === boardFilter;
        return statusOk && priorityOk && boardOk;
      }),
    [tasks, statusFilter, priorityFilter, boardFilter]
  );

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Tasks"
        title="My Tasks"
        description="Review assigned work with filters for status, priority, due date, and board."
      />
      <section className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <label className="text-sm font-black text-slate-700">
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            {["All", "Pending", "In Progress", "Completed", "Overdue"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-black text-slate-700">
          Priority
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            {["All", "High", "Medium", "Low"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-black text-slate-700">
          Due Date
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100">
            {["Any time", "Today", "This week", "Overdue"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-black text-slate-700">
          Board
          <select
            value={boardFilter}
            onChange={(event) => setBoardFilter(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            {boardOptions.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </section>
      {loading ? <TaskTable tasks={[]} showAction /> : <TaskTable tasks={filteredTasks} showAction />}
    </DashboardLayout>
  );
}
