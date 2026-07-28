import DashboardCard from '../components/DashboardCard';
import DashboardList from '../components/DashboardList';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import useDashboardData from '../hooks/useDashboardData';
import { getSecretaryDashboard } from '../services/dashboardService';

function SecretaryDashboard() {
  const { data, errorMessage, isLoading } = useDashboardData(getSecretaryDashboard);
  if (isLoading) return <p className="p-8">Loading dashboard...</p>;
  if (errorMessage) return <p className="p-8 text-red-600">{errorMessage}</p>;
  const showMeeting = (meeting) => `${meeting.title} — ${new Date(meeting.start_time).toLocaleString()}`;

  return <DashboardLayout><PageHeader title="Secretary Dashboard" description="Meeting and leave request overview." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><DashboardCard title="Today's Meetings" value={data.todayMeetings.length} /><DashboardCard title="Upcoming Meetings" value={data.upcomingMeetings.length} /><DashboardCard title="Executives" value={data.totalExecutives} /><DashboardCard title="Pending Leave Requests" value={data.pendingLeaveRequests} /><DashboardCard title="Meeting Responses Pending" value={data.meetingRequests} /><DashboardCard title="Available Meeting Rooms" value={data.availableMeetingRooms.length} detail="Room management is not enabled yet." /></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><DashboardList title="Today's Meetings" items={data.todayMeetings} renderItem={showMeeting} /><DashboardList title="Upcoming Meetings" items={data.upcomingMeetings} renderItem={showMeeting} /></div></DashboardLayout>;
}

export default SecretaryDashboard;
