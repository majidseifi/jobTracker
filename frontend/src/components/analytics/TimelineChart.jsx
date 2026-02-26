import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TimelineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3438" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          tickFormatter={(d) => d.slice(5)} // show MM-DD
        />
        <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
            color: '#e8e8e8',
          }}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="#E6A835"
          strokeWidth={2}
          dot={false}
          name="Cumulative"
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          strokeWidth={1.5}
          dot={false}
          name="Per Day"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TimelineChart;
