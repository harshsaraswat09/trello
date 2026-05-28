import {
  getWorkspaces,
  getBoardsByWorkspace,
  getListsByBoard,
  getCardsByList,
} from "./dashboard.api";
import { toBoardCard, toDateLabel, toWorkspaceCard } from "./dashboard.transforms";

const formatRelative = (isoDate) => {
  if (!isoDate) return "Recently";
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - then) / 60000));
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const toTaskRow = (card, boardTitle, listTitle) => {
  const dueDate = card.dueDate ? new Date(card.dueDate) : null;
  const isOverdue = dueDate ? dueDate.getTime() < Date.now() : false;
  const labelText = card.labels?.[0]?.text || "Medium";
  const normalizedPriority =
    labelText.toLowerCase() === "high" || isOverdue
      ? "High"
      : labelText.toLowerCase() === "low"
      ? "Low"
      : "Medium";

  return {
    id: card._id || card.id,
    title: card.title,
    board: boardTitle,
    assignedBy: listTitle,
    due: dueDate ? toDateLabel(card.dueDate) : "No date",
    dueDate: card.dueDate || null,
    priority: isOverdue ? "High" : normalizedPriority,
    status: isOverdue ? "Overdue" : "Pending",
    updatedAt: card.updatedAt || card.createdAt,
    assignedUsers: card.assignedUsers || [],
    createdBy: card.createdBy,
  };
};

export const loadDashboardData = async () => {
  const workspaceRaw = await getWorkspaces();
  const workspaces = workspaceRaw.map(toWorkspaceCard);

  const boardGroups = await Promise.all(
    workspaces.map(async (workspace) => {
      const boards = await getBoardsByWorkspace(workspace.id);
      return boards.map((board) => ({ ...board, workspaceName: workspace.name }));
    })
  );

  const rawBoards = boardGroups.flat();

  const boardSnapshots = await Promise.all(
    rawBoards.map(async (board) => {
      const boardId = board._id || board.id;
      const lists = await getListsByBoard(boardId);
      const listCards = await Promise.all(
        lists.map(async (list) => {
          const listId = list._id || list.id;
          const cards = await getCardsByList(listId);
          return { list, cards };
        })
      );
      return { board, lists, listCards };
    })
  );

  const boards = boardSnapshots.map(({ board, lists, listCards }) => {
    const cardCount = listCards.reduce((sum, item) => sum + item.cards.length, 0);
    return toBoardCard(
      {
        ...board,
        listCount: lists.length,
        cardCount,
        updatedAt: board.updatedAt || board.createdAt,
      },
      board.workspaceName
    );
  });

  const tasks = boardSnapshots.flatMap(({ board, listCards }) =>
    listCards.flatMap(({ list, cards }) =>
      cards.map((card) => toTaskRow(card, board.title || board.name, list.title))
    )
  );

  const urgentTasks = tasks.filter(
    (task) => task.priority === "High" || task.status === "Overdue"
  );

  const stats = [
    {
      label: "Total Workspaces",
      count: String(workspaces.length),
      trend: `${workspaces.length} connected`,
      icon: "WS",
    },
    {
      label: "Active Boards",
      count: String(boards.length),
      trend: `${boards.length} running`,
      icon: "BD",
    },
    {
      label: "My Pending Tasks",
      count: String(tasks.filter((task) => task.status === "Pending").length),
      trend: `${tasks.length} total`,
      icon: "TK",
    },
    {
      label: "Overdue Tasks",
      count: String(tasks.filter((task) => task.status === "Overdue").length),
      trend: `${urgentTasks.length} urgent`,
      icon: "OD",
    },
  ];

  const activities = tasks
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 8)
    .map((task) => ({
      user: (task.assignedBy || "U").charAt(0).toUpperCase(),
      text: `${task.assignedBy} updated ${task.title}`,
      time: formatRelative(task.updatedAt),
    }));

  const teamMap = new Map();
  tasks.forEach((task) => {
    (task.assignedUsers || []).forEach((userId) => {
      const id = String(userId);
      if (!teamMap.has(id)) {
        teamMap.set(id, {
          avatar: "U",
          name: `User ${id.slice(-4)}`,
          email: `user-${id.slice(-4)}@workspace.local`,
          role: "Member",
          online: false,
          joined: "N/A",
        });
      }
    });
  });

  const notifications = tasks
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 8)
    .map((task, index) => ({
      icon: task.status === "Overdue" ? "DD" : "TK",
      type: task.status === "Overdue" ? "Due date reminder" : "Task updated",
      text:
        task.status === "Overdue"
          ? `${task.title} is overdue`
          : `${task.title} was updated in ${task.board}`,
      time: formatRelative(task.updatedAt),
      unread: index < 3,
    }));

  return {
    workspaces,
    boards,
    tasks,
    urgentTasks,
    stats,
    activities,
    notifications,
    members: Array.from(teamMap.values()),
  };
};
