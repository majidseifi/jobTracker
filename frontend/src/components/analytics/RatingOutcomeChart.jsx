import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function RatingOutcomeChart({ ratingOutcome }) {
  if (!ratingOutcome || ratingOutcome.length === 0) return null;

  // Filter to only ratings that have data
  const data = ratingOutcome.filter((r) => r.total > 0);

  return (
    <div onClickCapture={(e) => e.stopPropagation()}>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" />
        <XAxis
          dataKey="rating"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          label={{ value: 'Rating', position: 'insideBottom', offset: -2, fill: '#6b7280', fontSize: 11 }}
        />
        <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          trigger="axis"
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '0.8rem' }} />
        <Bar dataKey="interviewed" stackId="a" fill="#8B5CF6" name="Interviewed" />
        <Bar dataKey="rejected" stackId="a" fill="#EF4444" name="Rejected" />
        <Bar dataKey="ghosted" stackId="a" fill="#7C3AED" name="Ghosted" />
        <Bar dataKey="applied" stackId="a" fill="#3B82F6" name="Applied" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default RatingOutcomeChart;
