import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Scatter
} from 'recharts';

const ranges = [
  { label: '1D', value: '1d' },
  { label: '5D', value: '5d' },
  { label: '1M', value: '1mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: '2Y', value: '2y' }
];

const tickers = [
  { label: 'S&P 500 (^GSPC)', value: '^GSPC' },
  { label: 'Apple (AAPL)', value: 'AAPL' },
  { label: 'Microsoft (MSFT)', value: 'MSFT' },
  { label: 'Amazon (AMZN)', value: 'AMZN' },
  { label: 'Nvidia (NVDA)', value: 'NVDA' },
  { label: 'Google (GOOGL)', value: 'GOOGL' }
];

function SignalChart() {
  const [ticker, setTicker] = useState('AAPL');
  const [selectedRange, setSelectedRange] = useState('6mo');
  const [data, setData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChartData = async () => {
    const url = `http://localhost:5000/api/stock?ticker=${encodeURIComponent(ticker)}&range=${selectedRange}&ma=50,200`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
  };

  const fetchSignals = async () => {
    const res = await fetch('http://localhost:5000/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: ticker,
        range: selectedRange,
        strategy: 'ma_cross',
        params: {
          short_ma: 50,
          long_ma: 200
        }
      })
    });
    const json = await res.json();
    setSignals(json);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchChartData(), fetchSignals()])
      .then(() => setLoading(false))
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [ticker, selectedRange]);

  return (
    <div>
      <h3>📈 股票图表 & 策略信号</h3>

      <div style={{ marginBottom: '10px' }}>
        <label>选择公司：</label>
        <select value={ticker} onChange={(e) => setTicker(e.target.value)}>
          {tickers.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        {ranges.map(r => (
          <button
            key={r.value}
            onClick={() => setSelectedRange(r.value)}
            style={{
              marginRight: '8px',
              padding: '6px 12px',
              backgroundColor: r.value === selectedRange ? '#8884d8' : '#eee',
              color: r.value === selectedRange ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? <p>正在加载数据...</p> : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

            <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close" dot={false} />
            <Line type="monotone" dataKey="ma50" stroke="#00b894" name="MA50" dot={false} />
            <Line type="monotone" dataKey="ma200" stroke="#e17055" name="MA200" dot={false} />

            {/* Buy signals */}
            <Scatter data={signals.filter(s => s.type === 'buy')} fill="#2ecc71" name="Buy Signal" shape="triangle" />
            {/* Sell signals */}
            <Scatter data={signals.filter(s => s.type === 'sell')} fill="#e74c3c" name="Sell Signal" shape="diamond" />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div style={{ marginTop: 12 }}>
        {signals.length === 0 ? <i>暂无信号</i> : (
          <ul>
            {signals.map((s, i) => (
              <li key={i}>
                {s.type === 'buy' ? '🟢 Buy' : '🔴 Sell'} @ {s.date} ${s.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SignalChart;
