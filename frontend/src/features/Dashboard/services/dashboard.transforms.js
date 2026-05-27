export const toDateLabel = (date) => {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const toWorkspaceCard = (workspace) => ({
  id: workspace._id || workspace.id,
  name: workspace.name,
  description:
    workspace.description ||
    "Workspace connected from your backend. Add descriptions later when the model supports them.",
  boards: workspace.boards ?? workspace.boardCount ?? 0,
  members: workspace.members ?? workspace.memberCount ?? 1,
  role: workspace.role || "Owner",
});

export const toBoardCard = (board, workspaceName = "Workspace") => ({
  id: board._id || board.id,
  title: board.title || board.name,
  workspace: board.workspace?.name || board.workspaceName || workspaceName,
  workspaceId: board.workspaceId,
  lists: board.lists ?? board.listCount ?? 0,
  cards: board.cards ?? board.cardCount ?? 0,
  progress: board.progress ?? 0,
  updated: board.updatedAt ? `${toDateLabel(board.updatedAt)}` : "Recently",
  members: board.members || ["W"],
});

export const toKanbanColumn = (list, cards = []) => ({
  id: list._id || list.id,
  title: list.title,
  tasks: cards.map((card) => ({
    id: card._id || card.id,
    title: card.title,
    priority: card.labels?.[0]?.text || "Medium",
    due: toDateLabel(card.dueDate),
    assignee: card.assignedUsers?.[0]?.name?.charAt(0) || "U",
    checklist: "0/0",
    comments: 0,
  })),
});
