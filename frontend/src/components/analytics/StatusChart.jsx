import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { STATUS_OPTIONS } from '../../utils/constants';

function StatusChart({ byStatus }) {
  const [activeIndex, setActiveIndex] = useState(undefined);

  const data = Object.entries(byStatus).map(([name, value]) => ({
    name,
    value,
  }));

  const getColor = (name) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === name);
    return opt ? opt.color : '#6B7280';
  };

  return (
    <div onClickCapture={(e) => e.stopPropagation()}>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          paddingAngle={2}
          activeIndex={activeIndex}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(undefined)}
          style={{ pointerEvents: 'all', cursor: 'default' }}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={getColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0d1b1e',
            border: '1px solid #1e3438',
            borderRadius: '6px',
          }}
          itemStyle={{ color: '#e8e8e8' }}
          labelStyle={{ color: '#9ca3af' }}
        />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: '0.8rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
}

export default StatusChart;
