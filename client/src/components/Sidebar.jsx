import { NavLink } from 'react-router-dom';
import { getDashboardPath } from '../utils/authRoutes';

const sidebarItems = {
  admin: ['Dashboard', 'Users', 'Reports', 'Settings'],
  secretary: ['Dashboard', 'Meetings', 'Appointments', 'Leave Requests'],
  executive: ['Dashboard', 'Appointments', 'Meetings', 'Personal Tasks', 'Leave'],
};

function Sidebar({ role }) {
  const dashboardPath = getDashboardPath(role);

  return (
    <aside className="w-full bg-slate-900 p-4 text-slate-100 md:min-h-screen md:w-56">
      <p className="mb-6 text-lg font-bold text-white">TMS Portal</p>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {sidebarItems[role].map((item) => (
          item === 'Dashboard' ? (
            <NavLink key={item} to={dashboardPath} className="rounded px-3 py-2 hover:bg-slate-700">{item}</NavLink>
          ) : (
            <span key={item} className="rounded px-3 py-2 text-slate-400">{item}</span>
          )
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
