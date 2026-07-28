import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getSavedUser } from '../services/authService';

function DashboardLayout({ children }) {
  const user = getSavedUser();

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar role={user.role} />
      <div className="min-w-0 flex-1">
        <Navbar user={user} />
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
