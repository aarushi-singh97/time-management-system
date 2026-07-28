import { Navigate } from 'react-router-dom';
import { getSavedUser } from '../services/authService';
import { getDashboardPath } from '../utils/authRoutes';

function ProtectedRoute({ allowedRole, children }) {
  const user = getSavedUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
