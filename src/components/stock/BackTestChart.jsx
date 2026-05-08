import React from 'react';
import {
    ResponsiveContainer, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import s from './style/BackTestChart.module.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className={s.tooltip}>
            <div className={s.tooltipDate}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, padding: '1px 0' }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </div>
            ))}
        </div>
    );
};

function BackTestChart({ data }) {
    const { summary = {}, metrics = {}, equity_curve = [], trades = [] } = data.backtest || {};

    if (!equity_curve.length && !trades.length) return null;

    const returnCls = metrics.total_return >= 0 ? s.positive : s.negative;
    const sharpeCls = metrics.sharpe_ratio >= 1 ? s.positive
        : metrics.sharpe_ratio >= 0.5 ? s.warning : s.negative;
    const winCls = metrics.win_rate >= 50 ? s.positive : s.warning;

    return (
        <div className={s.container}>
            <h3 className={s.title}>
                <span className={s.titleIcon}>◆</span> Backtest Results
            </h3>

            {/* Summary Cards */}
            <div className={s.summaryGrid}>
                <div className={s.card}>
                    <div className={s.cardLabel}>Initial</div>
                    <div className={`${s.cardValue} ${s.neutral}`}>
                        ${summary.initial_capital?.toLocaleString()}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>Final</div>
                    <div className={`${s.cardValue} ${returnCls}`}>
                        ${summary.final_capital?.toLocaleString()}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>Return</div>
                    <div className={`${s.cardValue} ${returnCls}`}>
                        {metrics.total_return > 0 ? '+' : ''}{metrics.total_return}%
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>Sharpe</div>
                    <div className={`${s.cardValue} ${sharpeCls}`}>
                        {metrics.sharpe_ratio}
                    </div>
                </div>
            </div>

            {/* Equity Curve */}
            <div className={s.chartWrap}>
                <ResponsiveContainer>
                    <LineChart data={equity_curve} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date" stroke="#4a5568"
                            tick={{ fill: '#4a5568', fontSize: 11 }}
                            tickLine={false} axisLine={{ stroke: '#1e2a3a' }}
                        />
                        <YAxis
                            stroke="#4a5568"
                            tick={{ fill: '#4a5568', fontSize: 11 }}
                            tickLine={false} axisLine={false} width={70}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#7a8ba3' }} />
                        <Line type="monotone" dataKey="portfolio_value" name="Portfolio"
                            dot={false} stroke="#b388ff" strokeWidth={1.5} />
                        <Line type="monotone" dataKey="position_value" name="Position"
                            dot={false} stroke="#ff9100" strokeWidth={1} strokeOpacity={0.7} />
                        <Line type="monotone" dataKey="cash" name="Cash"
                            dot={false} stroke="#ffd740" strokeWidth={1} strokeOpacity={0.7} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Metrics Row */}
            <div className={s.metricsGrid}>
                {[
                    { label: 'Ann. Return', val: `${metrics.annual_return}%`, cls: returnCls },
                    { label: 'Max DD', val: `${metrics.max_drawdown}%`, cls: s.negative },
                    { label: 'Win Rate', val: `${metrics.win_rate}%`, cls: winCls },
                    { label: 'Trades', val: metrics.trade_count, cls: s.neutral },
                    { label: 'Wins', val: metrics.win_count, cls: s.positive },
                    { label: 'Losses', val: metrics.loss_count, cls: s.negative },
                ].map(m => (
                    <div key={m.label} className={s.card}>
                        <div className={s.cardLabel}>{m.label}</div>
                        <div className={`${s.cardValue} ${m.cls}`}>{m.val}</div>
                    </div>
                ))}
            </div>

            {/* Trade Log */}
            {trades.length > 0 && (
                <>
                    <div className={s.sectionTitle}>Trade Log</div>
                    <div className={s.tableWrap}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Side</th>
                                    <th>Price</th>
                                    <th>Shares</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map((t, i) => (
                                    <tr key={i}>
                                        <td>{t.date}</td>
                                        <td className={t.type === 'buy' ? s.buy : s.sell}>
                                            {t.type === 'buy' ? 'BUY' : 'SELL'}
                                        </td>
                                        <td>${t.price}</td>
                                        <td>{t.shares}</td>
                                        <td>
                                            ${t.cost != null
                                                ? t.cost.toLocaleString()
                                                : t.proceeds?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default BackTestChart;