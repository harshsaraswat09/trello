import { Link } from "react-router-dom";
import {
  DashboardLayout,
  MemberCard,
  PageHeader,
} from "../components/DashboardComponents";
import { members } from "../data/dashboardData";

export default function TeamPage() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Team"
        title="Team Members"
        description="Review access levels, online presence, join dates, and collaboration roles."
        action={
          <Link
            to="/team/invite"
            className="inline-flex rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Invite Member
          </Link>
        }
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.email} member={member} />
        ))}
      </section>
    </DashboardLayout>
  );
}
