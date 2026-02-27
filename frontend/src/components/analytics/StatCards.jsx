import React from 'react';
import { CRow, CCol, CCard, CCardBody } from '@coreui/react';

function StatCards({ stats }) {
  const cards = [
    { label: 'Total Jobs', value: stats.summary.totalJobs, color: '#e8e8e8' },
    { label: 'Qualified', value: stats.summary.qualifiedJobs, color: '#10B981' },
    { label: 'Applied', value: stats.summary.totalApplied, color: '#3B82F6' },
    { label: 'Response Rate', value: `${stats.responseRate}%`, color: '#E6A835' },
    { label: 'Avg/Day', value: stats.summary.averageAppliedPerDay, color: '#06B6D4' },
    { label: 'Ghost Rate', value: `${stats.summary.ghostRate}%`, color: '#7C3AED' },
    { label: 'Interview Rate', value: `${stats.summary.interviewRate}%`, color: '#8B5CF6' },
    { label: 'Active Streak', value: `${stats.summary.activeStreak}d`, color: '#F59E0B' },
  ];

  return (
    <CRow className="mb-4 g-3">
      {cards.map((card) => (
        <CCol key={card.label} xs={6} sm={4} md={3}>
          <CCard className="stat-card-item">
            <CCardBody className="text-center py-3">
              <div className="stat-card-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="stat-card-label">{card.label}</div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
}

export default StatCards;
