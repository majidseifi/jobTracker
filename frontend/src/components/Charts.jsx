import React from 'react';
import { STATUS_OPTIONS } from '../utils/constants';

function Charts({ stats }) {
  if (!stats) return null;

  const { byStatus, byPlatform } = stats;

  const getStatusColor = (status) => {
    const config = STATUS_OPTIONS.find(s => s.value === status);
    return config ? config.color : '#95a5a6';
  };

  const renderBarChart = (data, title, getColor) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxValue = Math.max(...entries.map(([, value]) => value));

    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="bar-chart">
          {entries.map(([key, value]) => (
            <div key={key} className="bar-row">
              <div className="bar-label">{key}</div>
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    width: `${(value / maxValue) * 100}%`,
                    backgroundColor: getColor ? getColor(key) : '#3498db',
                  }}
                >
                  <span className="bar-value">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="charts">
      <div className="charts-grid">
        {renderBarChart(byStatus, 'Applications by Status', getStatusColor)}
        {renderBarChart(byPlatform, 'Applications by Platform')}
      </div>
    </div>
  );
}

export default Charts;
