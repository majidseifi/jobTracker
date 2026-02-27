import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FUNNEL_COLORS = {
  'Total Applied': '#3B82F6',
  'Ghosted': '#7C3AED',
  'Rejected': '#EF4444',
  'Interviewed': '#10B981',
};

function FunnelChart({ byStatus }) {
  if (!byStatus) return null;

  // Total Applied = Applied + Ghosted + Rejected + Interviewed (exclude Already Applied)
  const totalApplied =
    (byStatus['Applied'] || 0) +
    (byStatus['Ghosted'] || 0) +
    (byStatus['Rejected'] || 0) +
    (byStatus['Interviewed'] || 0);

  const data = [
    { name: 'Total Applied', value: totalApplied },
    { name: 'Ghosted', value: byStatus['Ghosted'] || 0 },
    { name: 'Rejected', value: byStatus['Rejected'] || 0 },
    { name: 'Interviewed', value: byStatus['Interviewed'] || 0 },
  ];

  return (
    <div onClickCapture={(e) => e.stopPropagation()}>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" horizontal={false} />
        <XAxis type="number" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          width={100}
        />
        <Tooltip
          trigger="axis"
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
          itemStyle={{ color: '#e8e8e8' }}
          labelStyle={{ color: '#9ca3af' }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Count">
          {data.map((entry) => (
            <Cell key={entry.name} fill={FUNNEL_COLORS[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default FunnelChart;
