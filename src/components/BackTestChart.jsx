// src/components/BackTestChart.jsx
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

function BackTestChart({ data }) {
  const { summary = {}, metrics = {}, equity_curve = [], trades = [] } = data.backtest || {}

  return (
    <div style={{ padding: 16 }}>
      <h3>回测结果</h3>

      {/* 1. Equity Curve */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={equity_curve}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolio_value"
              name="组合总价值"
              dot={false}
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="position_value"
              name="持仓价值"
              dot={false}
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="cash"
              name="现金"
              dot={false}
              stroke="#ffc658"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Summary */}
      <h4>摘要 (Summary)</h4>
      <ul>
        <li>初始资金: {summary.initial_capital}</li>
        <li>最终资产: {summary.final_capital}</li>
        <li>净收益: {summary.profit}</li>
        <li>回测区间: {summary.period}</li>
      </ul>

      {/* 3. Metrics */}
      <h4>绩效指标 (Metrics)</h4>
      <ul>
        <li>总收益率: {metrics.total_return}%</li>
        <li>年化收益率: {metrics.annual_return}%</li>
        <li>夏普比率: {metrics.sharpe_ratio}</li>
        <li>最大回撤: {metrics.max_drawdown}%</li>
        <li>胜率: {metrics.win_rate}%</li>
        <li>交易次数: {metrics.trade_count}</li>
      </ul>

      {/* 4. Trades */}
      <h4>交易明细 (Trades)</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>日期</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>类型</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>价格</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>份额</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>成本/收益</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{t.date}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>
                {t.type === 'buy' ? '买入' : '卖出'}
              </td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{t.price}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{t.shares}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>
                {t.cost != null ? t.cost : t.proceeds}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BackTestChart
