import { DashboardLayout, PageHeader } from "../components/DashboardComponents";
import { useEffect, useState } from "react";
import { loadDashboardData } from "../services/dashboard.live";

const days = Array.from({ length: 35 }, (_, index) => index + 1);

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    loadDashboardData().then((data) => {
      if (mounted) setTasks(data.tasks.slice(0, 8));
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Calendar"
        title="Calendar"
        description="A lightweight monthly view and upcoming due dates for assigned work."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">May 2026</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              Monthly view
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const active = [26, 27, 29].includes(day);
              return (
                <div
                  key={day}
                  className={`min-h-20 rounded-xl border p-2 text-sm font-bold transition ${
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {day <= 31 ? day : ""}
                  {active && <div className="mt-3 h-1.5 w-8 rounded-full bg-blue-600" />}
                </div>
              );
            })}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-950">Upcoming deadlines</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">{task.title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {task.board} · {task.due}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
