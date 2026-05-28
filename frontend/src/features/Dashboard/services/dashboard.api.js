import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (response) => response.data?.data ?? response.data;
export { api };

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");
  return unwrap(response);
};

export const createWorkspace = async ({ name }) => {
  const response = await api.post("/workspaces", { name });
  return unwrap(response);
};

export const getBoardsByWorkspace = async (workspaceId) => {
  const response = await api.get(`/workspaces/${workspaceId}/boards`);
  return unwrap(response);
};

export const createBoard = async (workspaceId, { title, visibility = "workspace" }) => {
  const response = await api.post(`/workspaces/${workspaceId}/boards`, {
    title,
    visibility,
  });
  return unwrap(response);
};

export const getBoardById = async (boardId) => {
  const response = await api.get(`/boards/${boardId}`);
  return unwrap(response);
};

export const getListsByBoard = async (boardId) => {
  const response = await api.get(`/boards/${boardId}/lists`);
  return unwrap(response);
};

export const createList = async (boardId, { title }) => {
  const response = await api.post(`/boards/${boardId}/lists`, { title });
  return unwrap(response);
};

export const getCardsByList = async (listId) => {
  const response = await api.get(`/lists/${listId}/cards`);
  return unwrap(response);
};

export const createCard = async (listId, payload) => {
  const response = await api.post(`/lists/${listId}/cards`, payload);
  return unwrap(response);
};

export const updateCard = async (cardId, payload) => {
  const response = await api.patch(`/cards/${cardId}`, payload);
  return unwrap(response);
};

export const deleteCard = async (cardId) => {
  const response = await api.delete(`/cards/${cardId}`);
  return unwrap(response);
};

export const getCommentsByCard = async (cardId) => {
  const response = await api.get(`/cards/${cardId}/comments`);
  return unwrap(response);
};
