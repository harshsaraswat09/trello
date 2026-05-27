import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/Dashboard/pages/DashboardPage";
import WorkspacesPage from "../features/Dashboard/pages/WorkspacesPage";
import NewWorkspacePage from "../features/Dashboard/pages/NewWorkspacePage";
import BoardsPage from "../features/Dashboard/pages/BoardsPage";
import NewBoardPage from "../features/Dashboard/pages/NewBoardPage";
import BoardDetailPage from "../features/Dashboard/pages/BoardDetailPage";
import TasksPage from "../features/Dashboard/pages/TasksPage";
import CalendarPage from "../features/Dashboard/pages/CalendarPage";
import NotificationsPage from "../features/Dashboard/pages/NotificationsPage";
import TeamPage from "../features/Dashboard/pages/TeamPage";
import SettingsPage from "../features/Dashboard/pages/SettingsPage";
import LandingPage from "../pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/workspaces",
    element: <WorkspacesPage />,
  },
  {
    path: "/workspaces/new",
    element: <NewWorkspacePage />,
  },
  {
    path: "/boards",
    element: <BoardsPage />,
  },
  {
    path: "/boards/new",
    element: <NewBoardPage />,
  },
  {
    path: "/boards/:boardId",
    element: <BoardDetailPage />,
  },
  {
    path: "/tasks",
    element: <TasksPage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/team",
    element: <TeamPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
]);

