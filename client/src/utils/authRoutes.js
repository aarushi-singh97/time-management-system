export function getDashboardPath(role) {
  const dashboardPaths = {
    admin: '/admin/dashboard',
    secretary: '/secretary/dashboard',
    executive: '/executive/dashboard',
  };

  return dashboardPaths[role] || '/login';
}
