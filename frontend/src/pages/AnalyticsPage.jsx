import React, { useState, useEffect, useCallback } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { getStats, getAllApplications } from '../utils/api';
import { useToast } from '../context/ToastContext';
import useSettings from '../hooks/useSettings';
import StatCards from '../components/analytics/StatCards';
import StatusChart from '../components/analytics/StatusChart';
import TimelineChart from '../components/analytics/TimelineChart';
import PlatformChart from '../components/analytics/PlatformChart';
import WeeklyChart from '../components/analytics/WeeklyChart';
import '../components/analytics/AnalyticsCharts.css';
import '../components/common/Skeleton.css';

function AnalyticsPage() {
  const { addToast } = useToast();
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        getStats(),
        getAllApplications(),
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      if (!silent) {
        addToast('Failed to load analytics. Is the backend running?', 'danger');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!settings.autoRefresh) return;

    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      fetchData(true);
    }, settings.refreshInterval);

    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval, fetchData]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1400 }}>
        <h1 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.75rem' }}>
          Analytics
        </h1>

        <CRow className="g-3 mb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CCol sm={6} lg={3} key={i}>
              <div className="skeleton-stat-card">
                <div className="skeleton-bar label" />
                <div className="skeleton-bar value" />
              </div>
            </CCol>
          ))}
        </CRow>

        <CRow className="g-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CCol md={6} key={i}>
              <div className="skeleton-card">
                <div className="skeleton-bar title" />
                <div className="skeleton-bar chart" />
              </div>
            </CCol>
          ))}
        </CRow>
      </div>
    );
  }

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
