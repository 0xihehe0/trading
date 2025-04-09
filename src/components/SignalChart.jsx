import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Scatter, Brush
} from 'recharts';
import { format, parseISO } from 'date-fns';

function SignalChart({ data, signals, mas = [] }) {
  const [hiddenKeys, setHiddenKeys] = useState([]);

  // 点击 legend 触发显示/隐藏
  const handleLegendClick = (e) => {
    const { dataKey } = e;
    setHiddenKeys((prev) =>
      prev.includes(dataKey)
        ? prev.filter((key) => key !== dataKey)
        : [...prev, dataKey]
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

        <XAxis
          dataKey="date"
          tickFormatter={(str) => {
            const date = parseISO(str);
            return format(date, 'MM-dd');
          }}
          minTickGap={20}
        />

        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />

        <Tooltip />
        <Legend onClick={handleLegendClick} />

        {/* 收盘线 */}
        {!hiddenKeys.includes('close') && (
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            name="Close"
            dot={false}
          />
        )}

        {/* 动态均线组 */}
        {mas.map((ma, index) => {
          const key = `ma${ma}`;
          return !hiddenKeys.includes(key) && (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={['#00b894', '#e17055', '#fdcb6e', '#6c5ce7'][index % 4]}
              name={`MA${ma}`}
              dot={false}
            />
          );
        })}

        {/* 策略信号点 */}
        {!hiddenKeys.includes('buy') && (
          <Scatter
            data={signals.filter(s => s.type === 'buy')}
            fill="#2ecc71"
            name="Buy Signal"
            shape="triangle"
          />
        )}
        {!hiddenKeys.includes('sell') && (
          <Scatter
            data={signals.filter(s => s.type === 'sell')}
            fill="#e74c3c"
            name="Sell Signal"
            shape="diamond"
          />
        )}

        <Brush dataKey="date" height={20} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SignalChart;
