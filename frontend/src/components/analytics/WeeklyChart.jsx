import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function WeeklyChart({ weeklyProgress, weeklyTarget }) {
  if (!weeklyProgress || weeklyProgress.length === 0) return null;

  return (
    <div onClickCapture={(e) => e.stopPropagation()}>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={weeklyProgress}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" />
        <XAxis dataKey="label" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          trigger="axis"
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
          cursor={{ fill: 'rgba(230, 168, 53, 0.1)' }}
        />
        {weeklyTarget > 0 && (
          <ReferenceLine
            y={weeklyTarget}
            stroke="#E6A835"
            strokeDasharray="6 4"
            strokeWidth={2}
            label={{
              value: `Target: ${weeklyTarget}`,
              position: 'right',
              fill: '#E6A835',
              fontSize: 11,
            }}
          />
        )}
        <Bar dataKey="count" fill="#E6A835" radius={[4, 4, 0, 0]} name="Applied" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChart;
