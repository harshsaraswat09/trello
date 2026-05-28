import {
  DashboardLayout,
  NotificationItem,
  PageHeader,
} from "../components/DashboardComponents";
import { useEffect, useState } from "react";
import { loadDashboardData } from "../services/dashboard.live";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    loadDashboardData().then((data) => {
      if (mounted) setNotifications(data.notifications);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Notifications"
        title="Notifications"
        description="All task assignments, mentions, due date reminders, and board invites."
        action={
          <button className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">
            Mark all as read
          </button>
        }
      />
      <section className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={`${notification.type}-${notification.time}-${notification.text}`} notification={notification} />
        ))}
      </section>
    </DashboardLayout>
  );
}
