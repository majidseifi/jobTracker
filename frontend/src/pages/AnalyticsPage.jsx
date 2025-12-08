import { useState, useEffect } from 'react';
import { getStats } from '../utils/api';
import Dashboard from '../components/Dashboard';
import Charts from '../components/Charts';

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div>Loading analytics...</div></div>;
  if (error) return <div className="page"><div>Error: {error}</div></div>;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p className="subtitle">Track your job application progress</p>
      </div>

      <Dashboard stats={stats} />
      <Charts stats={stats} />
    </div>
  );
}

export default AnalyticsPage;
