import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PlatformChart({ byPlatform }) {
  const data = Object.entries(byPlatform)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" />
        <XAxis type="number" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
        />
        <Bar dataKey="value" fill="#E6A835" radius={[0, 4, 4, 0]} name="Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PlatformChart;
