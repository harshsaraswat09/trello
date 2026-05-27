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

export const stats = [
  { label: "Total Workspaces", count: "4", trend: "+1 this month", icon: "WS" },
  { label: "Active Boards", count: "18", trend: "6 updated today", icon: "BD" },
  { label: "My Pending Tasks", count: "12", trend: "3 due this week", icon: "TK" },
  { label: "Overdue Tasks", count: "3", trend: "2 high priority", icon: "OD" },
];

export const workspaces = [
  {
    id: "erp-development",
    name: "ERP Development",
    description: "Engineering workspace for ERP modules, QA, releases, and fixes.",
    boards: 7,
    members: 12,
    role: "Owner",
  },
  {
    id: "website-redesign",
    name: "Website Redesign",
    description: "Design, content, testing, and launch planning for the new website.",
    boards: 4,
    members: 8,
    role: "Admin",
  },
  {
    id: "marketing-team",
    name: "Marketing Team",
    description: "Campaign planning, content calendars, approvals, and reporting.",
    boards: 3,
    members: 9,
    role: "Member",
  },
  {
    id: "client-projects",
    name: "Client Projects",
    description: "Delivery pipelines, client feedback, milestones, and handoffs.",
    boards: 4,
    members: 15,
    role: "Admin",
  },
];

export const boards = [
  {
    id: "erp-task-management",
    title: "ERP Task Management",
    workspace: "ERP Development",
    lists: 5,
    cards: 42,
    progress: 72,
    updated: "12 min ago",
    members: ["B", "A", "H"],
  },
  {
    id: "website-testing",
    title: "Website Testing",
    workspace: "Website Redesign",
    lists: 4,
    cards: 27,
    progress: 48,
    updated: "34 min ago",
    members: ["R", "S"],
  },
  {
    id: "client-delivery-pipeline",
    title: "Client Delivery Pipeline",
    workspace: "Client Projects",
    lists: 6,
    cards: 33,
    progress: 83,
    updated: "1 hr ago",
    members: ["K", "M", "P"],
  },
  {
    id: "internal-operations",
    title: "Internal Operations",
    workspace: "ERP Development",
    lists: 4,
    cards: 21,
    progress: 61,
    updated: "2 hrs ago",
    members: ["D", "N"],
  },
];

export const tasks = [
  {
    title: "Fix login page bug",
    board: "ERP Task Management",
    assignedBy: "Bhumika",
    due: "Today",
    dueDate: "2026-05-27",
    priority: "High",
    status: "In Progress",
  },
  {
    title: "Review ERP dashboard",
    board: "ERP Task Management",
    assignedBy: "Adarsh",
    due: "May 29",
    dueDate: "2026-05-29",
    priority: "Medium",
    status: "Pending",
  },
  {
    title: "Complete attendance module testing",
    board: "Website Testing",
    assignedBy: "Aashu",
    due: "Yesterday",
    dueDate: "2026-05-26",
    priority: "High",
    status: "Overdue",
  },
  {
    title: "Update client presentation",
    board: "Client Delivery Pipeline",
    assignedBy: "Bhumika",
    due: "Jun 3",
    dueDate: "2026-06-03",
    priority: "Low",
    status: "Completed",
  },
];

export const kanbanColumns = [
  {
    title: "Todo",
    tasks: [
      { title: "Prepare sprint notes", priority: "Medium", due: "May 30", assignee: "B", checklist: "2/5", comments: 3 },
      { title: "Map permission matrix", priority: "High", due: "Jun 1", assignee: "A", checklist: "1/4", comments: 2 },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      { title: "Fix login page bug", priority: "High", due: "Today", assignee: "H", checklist: "3/6", comments: 7 },
      { title: "Build board filters", priority: "Medium", due: "May 29", assignee: "S", checklist: "2/3", comments: 4 },
    ],
  },
  {
    title: "Review",
    tasks: [
      { title: "Review ERP dashboard", priority: "Medium", due: "May 29", assignee: "A", checklist: "4/4", comments: 6 },
    ],
  },
  {
    title: "Done",
    tasks: [
      { title: "Create auth screens", priority: "Low", due: "Done", assignee: "B", checklist: "5/5", comments: 1 },
    ],
  },
];

export const activities = [
  { user: "B", text: "Bhumika moved Login Fix to Done", time: "4 min ago" },
  { user: "A", text: "Adarsh commented on ERP Testing", time: "18 min ago" },
  { user: "AA", text: "Aashu created a new checklist", time: "42 min ago" },
  { user: "B", text: "Bhumika assigned a task to Adarsh", time: "1 hr ago" },
];

export const members = [
  { avatar: "B", name: "Bhumika Sharma", email: "bhumika@workflowos.app", role: "Owner", online: true, joined: "Jan 12, 2026" },
  { avatar: "A", name: "Adarsh Singh", email: "adarsh@workflowos.app", role: "Admin", online: true, joined: "Feb 3, 2026" },
  { avatar: "AA", name: "Aashu Verma", email: "aashu@workflowos.app", role: "Member", online: true, joined: "Mar 18, 2026" },
  { avatar: "G", name: "Guest User", email: "guest@client.com", role: "Guest", online: false, joined: "Apr 4, 2026" },
  { avatar: "V", name: "Viewer Demo", email: "viewer@workflowos.app", role: "Viewer", online: false, joined: "Apr 26, 2026" },
];

export const notifications = [
  { icon: "TK", type: "Task assigned", text: "New task assigned: Fix login page bug", time: "2 min ago", unread: true },
  { icon: "CM", type: "Mention in comment", text: "Adarsh mentioned you in ERP Testing", time: "16 min ago", unread: true },
  { icon: "DD", type: "Due date reminder", text: "Attendance testing is overdue", time: "1 hr ago", unread: false },
  { icon: "IN", type: "Board invite", text: "You were invited to Client Delivery Pipeline", time: "3 hrs ago", unread: false },
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
