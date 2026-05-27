import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  activities,
  navItems,
  priorityStyles,
  quickActions,
  statusStyles,
} from "../data/dashboardData";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20">
        W
      </span>
      <span className="text-xl font-black tracking-normal text-slate-950">
        WorkflowOS
      </span>
    </Link>
  );
}

export function Avatar({ label, size = "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600 font-black text-white ${sizeClass}`}
    >
      {label}
    </span>
  );
}

export function AvatarStack({ items }) {
  return (
    <div className="flex -space-x-2">
      {items.map((item) => (
        <Avatar key={item} label={item} size="sm" />
      ))}
    </div>
  );
}

export function Sidebar({ open, onClose, onLogout }) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/30 transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:self-start ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo />
        <nav className="mt-8 space-y-1">
          {navItems.map(([label, href, icon]) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg text-[11px] font-black ${
                    active ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-50 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function TopNavbar({ user, onMenu }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-xs font-black text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          ME
        </button>
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
            SR
          </span>
          <input
            type="search"
            placeholder="Search boards, cards, members..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <Link
          to="/tasks/new"
          className="hidden rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 sm:inline-flex"
        >
          + New
        </Link>
        <Link
          to="/notifications"
          className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          NT
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5">
          <Avatar label={(user?.name || "U").charAt(0).toUpperCase()} />
          <div className="hidden pr-2 sm:block">
            <p className="text-sm font-black text-slate-950">
              {user?.name || "Workflow User"}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="min-w-0 overflow-x-hidden">
        <TopNavbar user={user} onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-black tracking-normal text-slate-950">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function StatCard({ item }) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/5">
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-black text-white">
          {item.icon}
        </span>
        <span className="min-w-0 truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {item.trend}
        </span>
      </div>
      <p className="mt-5 text-3xl font-black text-slate-950">{item.count}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{item.label}</p>
    </article>
  );
}

export function WorkspaceCard({ workspace }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{workspace.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {workspace.description}
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
          {workspace.role}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">
        {workspace.boards} boards · {workspace.members} members
      </p>
      <Link
        to={`/workspaces/${workspace.id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        Open
      </Link>
    </article>
  );
}

export function BoardCard({ board }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{board.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {board.workspace}
          </p>
        </div>
        <span className="text-sm font-black text-blue-700">{board.progress}%</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">
        {board.lists} lists · {board.cards} cards
      </p>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
          style={{ width: `${board.progress}%` }}
        />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <AvatarStack items={board.members} />
        <span className="text-xs font-bold text-slate-500">{board.updated}</span>
      </div>
      <Link
        to={`/boards/${board.id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Open Board
      </Link>
    </article>
  );
}

export function TaskCard({ task }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-black leading-5 text-slate-950">{task.title}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
        <span>{task.due}</span>
        <Avatar label={task.assignee} size="sm" />
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-500">
        <span>Checklist {task.checklist}</span>
        <span>{task.comments} comments</span>
      </div>
    </article>
  );
}

export function TaskTable({ tasks, showAction = false }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
            {["Task Title", "Board", "Assigned By", "Due Date", "Priority", "Status"].map((head) => (
              <th key={head} className="px-5 py-4 font-black">{head}</th>
            ))}
            {showAction && <th className="px-5 py-4 font-black">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task.title} className="text-sm transition hover:bg-slate-50">
              <td className="px-5 py-4 font-black text-slate-900">{task.title}</td>
              <td className="px-5 py-4 font-semibold text-slate-600">{task.board}</td>
              <td className="px-5 py-4 font-semibold text-slate-600">{task.assignedBy}</td>
              <td className="px-5 py-4 font-semibold text-slate-600">{task.due}</td>
              <td className="px-5 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[task.status]}`}>
                  {task.status}
                </span>
              </td>
              {showAction && (
                <td className="px-5 py-4">
                  <Link to="/tasks/new" className="text-sm font-black text-blue-700 hover:text-blue-900">
                    Open
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActivityFeed({ items = activities }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle title="Recent Activity" />
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.text}-${item.time}`} className="flex gap-3">
            <Avatar label={item.user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">{item.text}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NotificationItem({ notification }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[11px] font-black text-blue-700">
        {notification.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-slate-900">{notification.type}</p>
        <p className="truncate text-sm font-semibold text-slate-600">{notification.text}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{notification.time}</p>
      </div>
      <span className={`h-2.5 w-2.5 rounded-full ${notification.unread ? "bg-blue-600" : "bg-slate-300"}`} />
    </div>
  );
}

export function MemberCard({ member }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/5">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar label={member.avatar} />
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${member.online ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black text-slate-950">{member.name}</h3>
          <p className="truncate text-sm font-semibold text-slate-500">{member.email}</p>
        </div>
        <button className="rounded-lg px-2 text-xl font-black text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          ...
        </button>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
          {member.role}
        </span>
        <span className="text-xs font-bold text-slate-500">Joined {member.joined}</span>
      </div>
    </article>
  );
}

export function QuickActions({ items = quickActions }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle title="Quick Actions" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(([label, href]) => (
          <Link
            key={label}
            to={href}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
