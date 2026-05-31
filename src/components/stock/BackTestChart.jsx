import React from 'react';
import {
    ResponsiveContainer, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useI18n } from '../../config/i18n';
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
    const { t } = useI18n();
    const { summary = {}, metrics = {}, equity_curve = [], trades = [] } = data.backtest || {};

    if (!equity_curve.length && !trades.length) return null;

    const returnCls = metrics.total_return >= 0 ? s.positive : s.negative;
    const sharpeCls = metrics.sharpe_ratio >= 1 ? s.positive
        : metrics.sharpe_ratio >= 0.5 ? s.warning : s.negative;
    const winCls = metrics.win_rate >= 50 ? s.positive : s.warning;

    return (
        <div className={s.container}>
            <h3 className={s.title}>
                <span className={s.titleIcon}>◆</span> {t('backtestResults')}
            </h3>

            {/* Summary Cards */}
            <div className={s.summaryGrid}>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('initial')}</div>
                    <div className={`${s.cardValue} ${s.neutral}`}>
                        ${summary.initial_capital?.toLocaleString()}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('final')}</div>
                    <div className={`${s.cardValue} ${returnCls}`}>
                        ${summary.final_capital?.toLocaleString()}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('return')}</div>
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
                        <Line type="monotone" dataKey="portfolio_value" name={t('portfolio')}
                            dot={false} stroke="#b388ff" strokeWidth={1.5} />
                        <Line type="monotone" dataKey="position_value" name={t('position')}
                            dot={false} stroke="#ff9100" strokeWidth={1} strokeOpacity={0.7} />
                        <Line type="monotone" dataKey="cash" name={t('cash')}
                            dot={false} stroke="#ffd740" strokeWidth={1} strokeOpacity={0.7} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Metrics Row */}
            <div className={s.metricsGrid}>
                {[
                    { label: t('annReturn'), val: `${metrics.annual_return}%`, cls: returnCls },
                    { label: t('maxDd'), val: `${metrics.max_drawdown}%`, cls: s.negative },
                    { label: t('winRate'), val: `${metrics.win_rate}%`, cls: winCls },
                    { label: t('trades'), val: metrics.trade_count, cls: s.neutral },
                    { label: t('wins'), val: metrics.win_count, cls: s.positive },
                    { label: t('losses'), val: metrics.loss_count, cls: s.negative },
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
                    <div className={s.sectionTitle}>{t('tradeLog')}</div>
                    <div className={s.tableWrap}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>{t('date')}</th>
                                    <th>{t('side')}</th>
                                    <th>{t('price')}</th>
                                    <th>{t('shares')}</th>
                                    <th>{t('amount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map((trade, i) => (
                                    <tr key={i}>
                                        <td>{trade.date}</td>
                                        <td className={trade.type === 'buy' ? s.buy : s.sell}>
                                            {trade.type === 'buy' ? t('buy') : t('sell')}
                                        </td>
                                        <td>${trade.price}</td>
                                        <td>{trade.shares}</td>
                                        <td>
                                            ${trade.cost != null
                                                ? trade.cost.toLocaleString()
                                                : trade.proceeds?.toLocaleString()}
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
