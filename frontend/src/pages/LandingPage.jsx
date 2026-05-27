import { Link } from "react-router-dom";

const highlights = [
  { value: "12k+", label: "Tasks managed weekly" },
  { value: "98.4%", label: "On-time delivery rate" },
  { value: "24/7", label: "Operational visibility" },
];

const features = [
  {
    title: "Sprint Planning",
    description:
      "Structure work into focused sprints with clear goals, capacity, and delivery checkpoints.",
  },
  {
    title: "Task Control",
    description:
      "Track tasks from backlog to done with assignees, dependencies, priorities, and status flows.",
  },
  {
    title: "Executive Visibility",
    description:
      "Give leadership a clean, realtime view of delivery health, risks, and team throughput.",
  },
];

const workflow = [
  "Create project",
  "Plan sprint",
  "Assign tasks",
  "Track progress",
  "Ship outcomes",
];

const boardColumns = [
  {
    title: "Planned",
    accent: "bg-amber-400",
    tasks: [
      { name: "Define release scope", tag: "High", time: "2h" },
      { name: "Review dependencies", tag: "Medium", time: "1h" },
    ],
  },
  {
    title: "In Progress",
    accent: "bg-sky-500",
    tasks: [
      { name: "Build sprint dashboard", tag: "High", time: "6h" },
      { name: "Integrate task routing", tag: "Critical", time: "8h" },
    ],
  },
  {
    title: "Done",
    accent: "bg-emerald-500",
    tasks: [
      { name: "Project setup", tag: "Done", time: "—" },
      { name: "RBAC policies", tag: "Done", time: "—" },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9ff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute right-[-6rem] top-28 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/25 blur-3xl" />
      </div>

      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="Taskly logo"
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <img
              src="/logo-text.png"
              alt="Taskly"
              className="h-9 w-auto object-contain sm:h-10"
            />
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#features"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
            >
              Workflow
            </a>
            <Link
              to="/login"
              className="rounded-full border border-blue-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-14">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-800 shadow-sm">
              Task management system
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Run projects, sprints, and tasks with one clear command center.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Plan delivery around real sprint cycles, keep teams aligned with
              live task status, and give leadership a clean, analytics-first
              view of execution. Built for enterprise teams that need
              structure, speed, and visibility.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Start free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                Explore features
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <div className="text-2xl font-black text-blue-950">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-20 w-20 rounded-2xl bg-blue-200/70 blur-2xl lg:block" />
            <div className="absolute -right-4 bottom-10 hidden h-24 w-24 rounded-full bg-cyan-200/80 blur-2xl lg:block" />

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950/95 p-4 shadow-[0_35px_90px_rgba(15,23,42,0.22)] ring-1 ring-blue-900/10">
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Delivery Console</div>
                  <div className="text-xs text-slate-400">Project velocity at a glance</div>
                </div>
                <div className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-200">
                  Live
                </div>
              </div>

              <div className="grid gap-4 p-2 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Sprint health</div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black text-white">87%</div>
                      <div className="mt-1 text-sm text-slate-400">On track this week</div>
                    </div>
                    <div className="flex h-20 w-20 items-end gap-1">
                      {[48, 62, 58, 76, 90].map((height) => (
                        <span
                          key={height}
                          className="block w-3 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus areas</div>
                  <div className="mt-3 space-y-3">
                    {[
                      ["Sprint planning", "24 tasks"],
                      ["Task assignments", "8 pending"],
                      ["Blocked items", "3 at risk"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                        <span className="text-sm text-slate-200">{label}</span>
                        <span className="text-sm font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-2 pt-0 sm:grid-cols-3">
                {boardColumns.map((column) => (
                  <div key={column.title} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 pb-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
                      <span className="text-sm font-semibold text-white">{column.title}</span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task) => (
                        <div key={task.name} className="rounded-xl bg-slate-900/80 p-3 shadow-sm">
                          <div className="text-sm font-medium text-slate-100">{task.name}</div>
                          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                            <span>{task.tag}</span>
                            <span>{task.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28"
        >
          <div className="max-w-2xl">
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-amber-700">
              Core capabilities
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything needed to plan, track, and deliver work.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
                  <span className="h-3 w-3 rounded-full bg-cyan-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="workflow"
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28"
        >
          <div className="grid gap-8 rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-8 text-white shadow-[0_35px_90px_rgba(15,23,42,0.2)] lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-blue-300">
                Workflow
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                A delivery flow that keeps teams aligned.
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">
                Move through a clean project lifecycle: create a project, plan
                the sprint, assign work, update progress, and close out with a
                single source of truth.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {workflow.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400 text-xs font-black text-slate-950">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Permissions
                </div>
                <div className="mt-3 text-lg font-bold">RBAC built for enterprise control</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Give managers the right visibility, while keeping admin
                  actions controlled and auditable.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Reporting
                </div>
                <div className="mt-3 text-lg font-bold">Analytics-ready dashboards</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Track project health, sprint performance, and task movement
                  in one dashboard view.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Stability
                </div>
                <div className="mt-3 text-lg font-bold">Built for scale, without visual clutter</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Clean hierarchy, responsive layouts, and a calm interface that
                  stays readable across desktop and mobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-10 text-slate-950 shadow-[0_30px_80px_rgba(245,158,11,0.25)] lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.28em] text-slate-800">
                  Ready to launch
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Bring structure to every project and sprint.
                </h2>
                <p className="mt-4 max-w-2xl text-slate-800/80">
                  Give your team a focused task management experience with
                  project tracking, sprint execution, and delivery visibility
                  that feels modern and controlled.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-950/15 bg-white/70 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-blue-100/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="Taskly logo" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
            <img src="/logo-text.png" alt="Taskly" className="h-14 w-auto object-contain sm:h-8" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="transition hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="transition hover:text-slate-900">Terms of Service</a>
            <a href="#" className="transition hover:text-slate-900">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
