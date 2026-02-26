import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function WeeklyChart({ applications }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const count = applications.filter(
      (app) =>
        (app.status === 'Applied' || app.status === 'Already Applied') &&
        app.appliedDate === dateStr
    ).length;
    data.push({ name: label, count });
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" />
        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
        />
        <Bar dataKey="count" fill="#E6A835" radius={[4, 4, 0, 0]} name="Applied" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default WeeklyChart;
