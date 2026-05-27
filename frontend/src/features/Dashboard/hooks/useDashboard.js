import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  setActiveTab,
  setActiveWorkspaceId,
  setActiveBoardId,
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  addBoard,
  removeBoard,
  addColumn,
  removeColumn,
  updateColumnTitle,
  addTask,
  removeTask,
  updateTask as updateTaskInState,
  moveTask as moveTaskInState,
  addActivity,
} from "../store/dashboard.slice.js";
import { dashboardApi } from "../services/dashboard.api.js";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const {
    workspaces,
    activeWorkspaceId,
    activeTab,
    boards,
    activeBoardId,
    columns,
    activities,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.name || "Harsh Saraswat";

  // Helper helper to handle API calls with offline fallback
  async function performAction(apiCall, localAction, activityLog = null) {
    dispatch(setLoading(true));
    try {
      // 1. Try to call the API
      let responseData = null;
      if (apiCall) {
        const response = await apiCall();
        responseData = response.data;
      }
      
      // 2. Dispatch Redux action
      dispatch(localAction);

      // 3. Log Activity if specified
      if (activityLog) {
        dispatch(addActivity({
          user: currentUser,
          action: activityLog.action,
          target: activityLog.target,
        }));
      }

      return responseData;
    } catch (err) {
      console.warn("API action failed, falling back to local client state:", err.message);
      
      // Fallback: Perform local action anyway to maintain complete single-page interactive experience
      dispatch(localAction);

      if (activityLog) {
        dispatch(addActivity({
          user: currentUser,
          action: activityLog.action,
          target: activityLog.target,
        }));
      }
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  // Workspaces
  const selectWorkspace = (workspaceId) => {
    dispatch(setActiveWorkspaceId(workspaceId));
    dispatch(setActiveTab("boards"));
  };

  const selectTab = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const selectBoard = (boardId) => {
    dispatch(setActiveBoardId(boardId));
  };

  const createNewWorkspace = async ({ name, description, icon = "📁" }) => {
    const newWs = {
      _id: `ws-${Date.now()}`,
      name,
      description,
      icon,
      type: "Free",
    };
    
    return performAction(
      () => dashboardApi.createWorkspace(newWs),
      addWorkspace(newWs),
      { action: "created workspace", target: name }
    );
  };

  const editWorkspace = async (workspaceId, { name, description, icon }) => {
    const updated = { _id: workspaceId, name, description, icon };
    return performAction(
      () => dashboardApi.updateWorkspace(workspaceId, updated),
      updateWorkspace(updated),
      { action: "updated workspace settings", target: name }
    );
  };

  const deleteWorkspace = async (workspaceId, name) => {
    return performAction(
      () => dashboardApi.deleteWorkspace(workspaceId),
      removeWorkspace(workspaceId),
      { action: "deleted workspace", target: name }
    );
  };

  // Boards
  const createNewBoard = async ({ name, bgType = "image", bgValue }) => {
    const newBoard = {
      _id: `b-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name,
      bgType,
      bgValue,
    };

    return performAction(
      () => dashboardApi.createBoard(activeWorkspaceId, newBoard),
      addBoard(newBoard),
      { action: "created board", target: name }
    );
  };

  const deleteBoard = async (boardId, name) => {
    return performAction(
      () => dashboardApi.deleteBoard(boardId),
      removeBoard(boardId),
      { action: "deleted board", target: name }
    );
  };

  // Columns
  const createNewColumn = async (boardId, title) => {
    const newCol = {
      _id: `col-${Date.now()}`,
      boardId,
      title,
      color: "bg-slate-200 text-slate-700",
      tasks: [],
    };

    const board = boards.find(b => b._id === boardId);

    return performAction(
      () => dashboardApi.createColumn(boardId, newCol),
      addColumn(newCol),
      { action: "added list", target: `${title} in ${board?.name || "board"}` }
    );
  };

  const updateColumn = async (columnId, title) => {
    return performAction(
      () => dashboardApi.updateColumn(columnId, { title }),
      updateColumnTitle({ columnId, title }),
      { action: "renamed list", target: title }
    );
  };

  const deleteColumn = async (columnId, title) => {
    return performAction(
      () => dashboardApi.deleteColumn(columnId),
      removeColumn(columnId),
      { action: "deleted list", target: title }
    );
  };

  // Tasks
  const createNewTask = async (columnId, { title, description, tags = [] }) => {
    const newTask = {
      id: `t-${Date.now()}`,
      _id: `t-${Date.now()}`,
      title,
      description,
      tags,
      comments: 0,
      attachments: 0,
    };

    return performAction(
      () => dashboardApi.createTask(columnId, newTask),
      addTask({ columnId, task: newTask }),
      { action: "added card", target: `"${title}"` }
    );
  };

  const editTask = async (columnId, task) => {
    return performAction(
      () => dashboardApi.updateTask(task.id || task._id, task),
      updateTaskInState({ columnId, task }),
      { action: "updated card", target: `"${task.title}"` }
    );
  };

  const deleteTask = async (columnId, taskId, taskTitle) => {
    return performAction(
      () => dashboardApi.deleteTask(taskId),
      removeTask({ columnId, taskId }),
      { action: "deleted card", target: `"${taskTitle}"` }
    );
  };

  const moveTaskBetweenColumns = async (sourceColId, destColId, taskId, taskTitle, destColTitle) => {
    return performAction(
      () => dashboardApi.moveTask(taskId, { sourceColId, destColId }),
      moveTaskInState({ sourceColId, destColId, taskId }),
      { action: "moved card", target: `"${taskTitle}" to ${destColTitle}` }
    );
  };

  const upgradeWorkspace = async (workspaceId, name) => {
    const updated = { _id: workspaceId, type: "Pro" };
    return performAction(
      null,
      updateWorkspace(updated),
      { action: "upgraded workspace", target: `${name} to Pro Tier` }
    );
  };

  // Computed state
  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);
  const activeWorkspaceBoards = boards.filter((b) => b.workspaceId === activeWorkspaceId);
  const activeBoard = boards.find((b) => b._id === activeBoardId);
  const activeBoardColumns = columns.filter((c) => c.boardId === activeBoardId);
  const activeWorkspaceActivities = activities.filter((a) => a.workspaceId === activeWorkspaceId);

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    activeTab,
    boards,
    activeWorkspaceBoards,
    activeBoardId,
    activeBoard,
    columns: activeBoardColumns,
    activities: activeWorkspaceActivities,
    loading,
    error,
    
    // Actions
    selectWorkspace,
    selectTab,
    selectBoard,
    createNewWorkspace,
    editWorkspace,
    deleteWorkspace,
    createNewBoard,
    deleteBoard,
    createNewColumn,
    updateColumn,
    deleteColumn,
    createNewTask,
    editTask,
    deleteTask,
    moveTaskBetweenColumns,
    upgradeWorkspace,
  };
};
