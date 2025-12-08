import React from 'react';

function Dashboard({ stats }) {
  if (!stats) return null;

  const { summary, responseRate, averageDaysToInterview } = stats;

  const cards = [
    {
      title: 'Total Jobs',
      value: summary.totalJobs,
      color: '#3498db',
    },
    {
      title: 'Total Applied',
      value: summary.totalApplied,
      color: '#2ecc71',
    },
    {
      title: 'Remaining To-Do',
      value: summary.remainingToApply,
      color: '#f39c12',
    },
    {
      title: 'Response Rate',
      value: `${responseRate}%`,
      color: '#9b59b6',
    },
    {
      title: 'Avg Applied/Day',
      value: summary.averageAppliedPerDay,
      color: '#1abc9c',
    },
    {
      title: 'Daily Target',
      value: summary.jobsToApplyDaily,
      color: '#e74c3c',
    },
    {
      title: 'Avg Days to Interview',
      value: averageDaysToInterview > 0 ? `${averageDaysToInterview} days` : 'N/A',
      color: '#34495e',
    },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
            <h3>{card.title}</h3>
            <p className="stat-value">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
