export const navItems = [
  ["Dashboard", "/dashboard", "DB"],
  ["Workspaces", "/workspaces", "WS"],
  ["Boards", "/boards", "BD"],
  ["My Tasks", "/tasks", "TK"],
  ["Calendar", "/calendar", "CA"],
  ["Notifications", "/notifications", "NT"],
  ["Team Members", "/team", "TM"],
  ["Settings", "/settings", "ST"],
];

export const quickActions = [
  ["Create Workspace", "/workspaces/new"],
  ["Create Board", "/boards/new"],
  ["Create Task", "/tasks/new"],
  ["Invite Member", "/team/invite"],
];

export const priorityStyles = {
  High: "bg-rose-50 text-rose-700 ring-rose-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export const statusStyles = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Overdue: "bg-rose-50 text-rose-700",
};
