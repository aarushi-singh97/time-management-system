import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SecretaryDashboard from './pages/SecretaryDashboard';
import AddAppointment from './pages/AddAppointment';
import AppointmentDetails from './pages/AppointmentDetails';
import Appointments from './pages/Appointments';
import EditAppointment from './pages/EditAppointment';
import Meetings from './pages/Meetings';
import CreateMeeting from './pages/CreateMeeting';
import MeetingDetails from './pages/MeetingDetails';
import Leave from './pages/Leave';
import LeaveRequests from './pages/LeaveRequests';
import Tasks from './pages/Tasks';
import { getSavedUser } from './services/authService';
import { getDashboardPath } from './utils/authRoutes';

function HomeRedirect() {
  const user = getSavedUser();
  return <Navigate to={user ? getDashboardPath(user.role) : '/login'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/secretary/dashboard" element={<ProtectedRoute allowedRole="secretary"><SecretaryDashboard /></ProtectedRoute>} />
        <Route path="/executive/dashboard" element={<ProtectedRoute allowedRole="executive"><ExecutiveDashboard /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute allowedRole="executive"><Appointments /></ProtectedRoute>} />
        <Route path="/appointments/add" element={<ProtectedRoute allowedRole="executive"><AddAppointment /></ProtectedRoute>} />
        <Route path="/appointments/edit/:id" element={<ProtectedRoute allowedRole="executive"><EditAppointment /></ProtectedRoute>} />
        <Route path="/appointments/:id" element={<ProtectedRoute allowedRole="executive"><AppointmentDetails /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
        <Route path="/meetings/create" element={<ProtectedRoute allowedRole={['secretary', 'admin']}><CreateMeeting /></ProtectedRoute>} />
        <Route path="/meetings/:id" element={<ProtectedRoute><MeetingDetails /></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute allowedRole="executive"><Leave /></ProtectedRoute>} />
        <Route path="/leave-requests" element={<ProtectedRoute allowedRole={['secretary', 'admin']}><LeaveRequests /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRole="executive"><Tasks /></ProtectedRoute>} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
