import { useEffect, useState } from 'react';

function useDashboardData(loadDashboard) {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setData(await loadDashboard());
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Could not load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [loadDashboard]);

  return { data, errorMessage, isLoading };
}

export default useDashboardData;
