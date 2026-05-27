import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: `${BASE}/v1`,
});

// Automatically inject JWT token into all requests if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardApi = {
  // Workspaces (mapped to Projects)
  getWorkspaces: () => api.get("/projects"),
  createWorkspace: (workspace) => api.post("/projects", workspace),
  updateWorkspace: (id, workspace) => api.put(`/projects/${id}`, workspace),
  deleteWorkspace: (id) => api.delete(`/projects/${id}`),

  // Boards
  getBoards: (workspaceId) => api.get(`/boards?workspaceId=${workspaceId}`),
  createBoard: (workspaceId, board) => api.post("/boards", { ...board, workspaceId }),
  updateBoard: (id, board) => api.put(`/boards/${id}`, board),
  deleteBoard: (id) => api.delete(`/boards/${id}`),

  // Columns (Lists)
  getColumns: (boardId) => api.get(`/lists?boardId=${boardId}`),
  createColumn: (boardId, column) => api.post("/lists", { ...column, boardId }),
  updateColumn: (id, column) => api.put(`/lists/${id}`, column),
  deleteColumn: (id) => api.delete(`/lists/${id}`),
  
  // Tasks (Cards)
  getTasks: (listId) => api.get(`/cards?listId=${listId}`),
  createTask: (listId, task) => api.post("/cards", { ...task, listId }),
  updateTask: (id, task) => api.put(`/cards/${id}`, task),
  deleteTask: (id) => api.delete(`/cards/${id}`),
  moveTask: (id, payload) => api.patch(`/cards/${id}/move`, { destListId: payload.destColId, order: payload.order }),
};
