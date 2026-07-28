import DashboardCard from '../components/DashboardCard';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import useDashboardData from '../hooks/useDashboardData';
import { getAdminDashboard } from '../services/dashboardService';

function AdminDashboard() {
  const { data, errorMessage, isLoading } = useDashboardData(getAdminDashboard);

  if (isLoading) return <p className="p-8">Loading dashboard...</p>;
  if (errorMessage) return <p className="p-8 text-red-600">{errorMessage}</p>;

  const cards = [
    ['Total Users', data.totalUsers], ['Executives', data.totalExecutives], ['Secretaries', data.totalSecretaries],
    ['Meetings', data.totalMeetings], ['Appointments', data.totalAppointments], ['Leave Requests', data.totalLeaveRequests], ['Projects', data.totalProjects],
  ];

  return <DashboardLayout><PageHeader title="Admin Dashboard" description="A summary of all TMS records." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value]) => <DashboardCard key={title} title={title} value={value} />)}</div></DashboardLayout>;
}

export default AdminDashboard;
