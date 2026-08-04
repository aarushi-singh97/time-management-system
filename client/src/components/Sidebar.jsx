import { NavLink } from 'react-router-dom';
import { getDashboardPath } from '../utils/authRoutes';

const sidebarItems = {
  admin: ['Dashboard', 'Users', 'Reports', 'Settings'],
  secretary: ['Dashboard', 'Meetings', 'Leave Requests', 'Reports', 'Settings'],
  executive: ['Dashboard', 'Appointments', 'Meetings', 'Personal Tasks', 'Leave', 'Reports', 'Settings'],
};

function Sidebar({ role }) {
  const dashboardPath = getDashboardPath(role);

  return (
    <aside className="w-full bg-slate-900 p-4 text-slate-100 md:min-h-screen md:w-56">
      <p className="mb-6 text-lg font-bold text-white">TMS Portal</p>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {sidebarItems[role].map((item) => (
          item === 'Dashboard' || item === 'Reports' || item === 'Settings' || (role === 'executive' && ['Appointments', 'Meetings', 'Personal Tasks', 'Leave'].includes(item)) || (role === 'secretary' && ['Meetings', 'Leave Requests'].includes(item)) ? (
            <NavLink key={item} to={item === 'Dashboard' ? dashboardPath : item === 'Appointments' ? '/appointments' : item === 'Meetings' ? '/meetings' : item === 'Personal Tasks' ? '/tasks' : item === 'Leave' ? '/leave' : item === 'Reports' ? '/reports' : item === 'Settings' ? '/notification-settings' : '/leave-requests'} className="rounded px-3 py-2 hover:bg-slate-700">{item}</NavLink>
          ) : (
            <span key={item} className="rounded px-3 py-2 text-slate-400">{item}</span>
          )
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
