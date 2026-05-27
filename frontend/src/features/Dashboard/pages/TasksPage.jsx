import {
  DashboardLayout,
  PageHeader,
  TaskTable,
} from "../components/DashboardComponents";
import { boards, tasks } from "../data/dashboardData";

const filters = {
  Status: ["All", "Pending", "In Progress", "Completed", "Overdue"],
  Priority: ["All", "High", "Medium", "Low"],
  "Due Date": ["Any time", "Today", "This week", "Overdue"],
  Board: ["All", ...boards.map((board) => board.title)],
};

export default function TasksPage() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Tasks"
        title="My Tasks"
        description="Review assigned work with filters for status, priority, due date, and board."
      />
      <section className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        {Object.entries(filters).map(([label, values]) => (
          <label key={label} className="text-sm font-black text-slate-700">
            {label}
            <select className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100">
              {values.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
      </section>
      <TaskTable tasks={tasks} showAction />
    </DashboardLayout>
  );
}
