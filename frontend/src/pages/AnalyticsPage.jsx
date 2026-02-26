import React, { useState, useEffect } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { getStats, getAllApplications } from '../utils/api';
import StatCards from '../components/analytics/StatCards';
import StatusChart from '../components/analytics/StatusChart';
import TimelineChart from '../components/analytics/TimelineChart';
import PlatformChart from '../components/analytics/PlatformChart';
import WeeklyChart from '../components/analytics/WeeklyChart';
import '../components/analytics/AnalyticsCharts.css';

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, appsRes] = await Promise.all([
          getStats(),
          getAllApplications(),
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="empty-state">{error}</div>;
  if (!stats) return null;

  return (
    <div style={{ maxWidth: 1400 }}>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.75rem' }}>
        Analytics
      </h1>

      <StatCards stats={stats} />

      <CRow className="g-3">
        <CCol md={6}>
          <CCard className="chart-card">
            <CCardHeader>Status Breakdown</CCardHeader>
            <CCardBody>
              <StatusChart byStatus={stats.byStatus} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="chart-card">
            <CCardHeader>Applications Over Time</CCardHeader>
            <CCardBody>
              <TimelineChart data={stats.applicationsByDateApplied} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="chart-card">
            <CCardHeader>Platform Distribution</CCardHeader>
            <CCardBody>
              <PlatformChart byPlatform={stats.byPlatform} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="chart-card">
            <CCardHeader>Last 7 Days</CCardHeader>
            <CCardBody>
              <WeeklyChart applications={applications} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export default AnalyticsPage;
