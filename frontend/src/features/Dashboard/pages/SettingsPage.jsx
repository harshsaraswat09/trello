import { DashboardLayout, PageHeader } from "../components/DashboardComponents";

const settings = [
  {
    title: "Profile settings",
    items: ["Display name", "Email address", "Role visibility"],
  },
  {
    title: "Workspace settings",
    items: ["Default workspace", "Board templates", "Member invites"],
  },
  {
    title: "Notification preferences",
    items: ["Task assignments", "Mentions", "Due date reminders"],
  },
  {
    title: "Security",
    items: ["Password update", "Active sessions", "Two-step verification"],
  },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Dummy settings UI for profile, workspace defaults, notifications, security, and theme."
      />
      <section className="grid gap-5 lg:grid-cols-2">
        {settings.map((section) => (
          <article key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
            <div className="mt-5 space-y-3">
              {section.items.map((item) => (
                <label key={item} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                  <input type="checkbox" className="h-5 w-5 accent-blue-700" defaultChecked />
                </label>
              ))}
            </div>
          </article>
        ))}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-black text-slate-950">Theme preference</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Light", "System", "Dark preview"].map((theme) => (
              <button
                key={theme}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {theme}
              </button>
            ))}
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}
