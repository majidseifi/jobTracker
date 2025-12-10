import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications, getStats } from '../utils/api';

function HomePage() {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        getStats(),
        getAllApplications(),
      ]);

      setStats(statsRes.data);

      const sorted = appsRes.data
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3);
      setRecentApps(sorted);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div>Loading...</div></div>;

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Job Application Tracker</h1>
        <p>Stay organized and land your dream job</p>
      </header>

      {stats && (
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.summary.totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.summary.totalApplied}</div>
            <div className="stat-label">Applied</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.summary.remainingToApply}</div>
            <div className="stat-label">To-Do</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.responseRate}%</div>
            <div className="stat-label">Response Rate</div>
          </div>
        </div>
      )}

      {recentApps.length > 0 && (
        <section className="recent-applications">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/applications" className="view-all">View All →</Link>
          </div>
          <div className="recent-list">
            {recentApps.map(app => (
              <div key={app.id} className="recent-card">
                <h3>{app.companyName}</h3>
                <p className="job-title">{app.title}</p>
                <span className="status-badge">{app.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="quick-actions">
        <Link to="/applications" className="action-card">
          <div className="action-icon">📝</div>
          <h3>Add Application</h3>
          <p>Track a new job application</p>
        </Link>
        <Link to="/kanban" className="action-card">
          <div className="action-icon">📋</div>
          <h3>Kanban Board</h3>
          <p>Manage your pipeline</p>
        </Link>
        <Link to="/analytics" className="action-card">
          <div className="action-icon">📊</div>
          <h3>Analytics</h3>
          <p>View your progress</p>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
