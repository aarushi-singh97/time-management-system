import DashboardCard from '../components/DashboardCard';
import DashboardList from '../components/DashboardList';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import useDashboardData from '../hooks/useDashboardData';
import { getExecutiveDashboard } from '../services/dashboardService';

function ExecutiveDashboard() {
  const { data, errorMessage, isLoading } = useDashboardData(getExecutiveDashboard);
  if (isLoading) return <p className="p-8">Loading dashboard...</p>;
  if (errorMessage) return <p className="p-8 text-red-600">{errorMessage}</p>;
  const showTimedItem = (item) => `${item.title} — ${new Date(item.start_time).toLocaleString()}`;
  const showTask = (task) => `${task.title} (${task.priority} priority)`;

  return <DashboardLayout><PageHeader title="Executive Dashboard" description="Your schedule, tasks, and leave information." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><DashboardCard title="Today's Appointments" value={data.todayAppointments.length} /><DashboardCard title="Today's Meetings" value={data.todayMeetings.length} /><DashboardCard title="Upcoming Meetings" value={data.upcomingMeetings.length} /><DashboardCard title="Open Tasks" value={data.personalTasks.length} /><DashboardCard title="Latest Leave Status" value={data.leaveStatus?.status || 'None'} /></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><DashboardList title="Today's Appointments" items={data.todayAppointments} renderItem={showTimedItem} /><DashboardList title="Upcoming Meetings" items={data.upcomingMeetings} renderItem={showTimedItem} /><DashboardList title="Personal Tasks" items={data.personalTasks} renderItem={showTask} /></div></DashboardLayout>;
}

export default ExecutiveDashboard;
