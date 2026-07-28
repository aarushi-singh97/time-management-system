import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

function Navbar({ user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-5 py-4">
      <p className="font-semibold text-slate-800">Time Management System</p>
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-medium">{user.full_name}</p>
          <p className="capitalize text-slate-500">{user.role}</p>
        </div>
        <button className="rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
