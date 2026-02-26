import React from 'react';
import { CRow, CCol, CCard, CCardBody } from '@coreui/react';

function StatCards({ stats }) {
  const cards = [
    { label: 'Total Jobs', value: stats.summary.totalJobs },
    { label: 'Applied', value: stats.summary.totalApplied },
    { label: 'Remaining', value: stats.summary.remainingToApply },
    { label: 'Response Rate', value: `${stats.responseRate}%` },
    { label: 'Avg/Day', value: stats.summary.averageAppliedPerDay },
  ];

  return (
    <CRow className="mb-4 g-3">
      {cards.map((card) => (
        <CCol key={card.label} xs={6} md={4} xl>
          <CCard className="stat-card-item">
            <CCardBody className="text-center py-3">
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
}

export default StatCards;
