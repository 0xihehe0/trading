import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceArea,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useI18n } from '../../config/i18n';
import s from './style/FactorResult.module.css';

function pct(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '--';
    const n = Number(value);
    return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function money(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '--';
    return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function buildComparison(result) {
    const equity = result?.backtest?.equity_curve || [];
    const series = result?.series || [];
    const initial = Number(result?.backtest?.summary?.initial_capital || 10000);
    const closeMap = new Map(series.map(row => [row.date, Number(row.close)]));
    const firstClose = equity.length ? closeMap.get(equity[0].date) : null;

    if (!firstClose) return [];

    return equity.map(row => {
        const close = closeMap.get(row.date);
        const benchmark = close ? initial * close / firstClose : null;
        return {
            date: row.date,
            strategy: Number(row.portfolio_value),
            benchmark: benchmark ? Number(benchmark.toFixed(2)) : null,
        };
    });
}

function buildSignalMarkers(signals, comparison) {
    const valueByDate = new Map(comparison.map(row => [row.date, row.strategy]));
    return signals
        .map(signal => ({
            date: signal.date,
            strategy: valueByDate.get(signal.date),
            type: signal.type,
        }))
        .filter(item => item.strategy !== undefined);
}

function FactorResult({ result }) {
    const { t } = useI18n();
    if (!result) return null;

    const summary = result.backtest?.summary || {};
    const metrics = result.backtest?.metrics || {};
    const comparison = buildComparison(result);
    const benchmarkFinal = comparison.length ? comparison[comparison.length - 1].benchmark : null;
    const initial = Number(summary.initial_capital || 10000);
    const benchmarkReturn = benchmarkFinal ? (benchmarkFinal / initial - 1) * 100 : null;
    const strategyReturn = Number(metrics.total_return || 0);
    const alpha = benchmarkReturn === null ? null : strategyReturn - benchmarkReturn;
    const periods = result.matched_periods || [];
    const signals = result.signals || [];
    const buyMarkers = buildSignalMarkers(signals.filter(signal => signal.type === 'buy'), comparison);
    const sellMarkers = buildSignalMarkers(signals.filter(signal => signal.type === 'sell'), comparison);

    return (
        <div className={s.container}>
            <div className={s.title}>{t('factorResult')}</div>

            <div className={s.summaryGrid}>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('finalCapital')}</div>
                    <div className={s.cardValue}>${money(summary.final_capital)}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('strategyReturn')}</div>
                    <div className={`${s.cardValue} ${strategyReturn >= 0 ? s.positive : s.negative}`}>
                        {pct(strategyReturn)}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('buyHold')}</div>
                    <div className={`${s.cardValue} ${benchmarkReturn >= 0 ? s.positive : s.negative}`}>
                        {pct(benchmarkReturn)}
                    </div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('alpha')}</div>
                    <div className={`${s.cardValue} ${alpha >= 0 ? s.positive : s.negative}`}>
                        {pct(alpha)}
                    </div>
                </div>
            </div>

            <div className={s.metricsGrid}>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('entryDays')}</div>
                    <div className={s.metricValue}>{result.meta?.entry_match_days ?? result.meta?.match_days ?? 0}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('exitDays')}</div>
                    <div className={s.metricValue}>{result.meta?.exit_match_days ?? 0}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('holdingDays')}</div>
                    <div className={s.metricValue}>{result.meta?.holding_days ?? 0}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('signals')}</div>
                    <div className={s.metricValue}>{result.meta?.signal_count ?? signals.length}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('trades')}</div>
                    <div className={s.metricValue}>{metrics.trade_count ?? 0}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('maxDd')}</div>
                    <div className={`${s.metricValue} ${s.negative}`}>{pct(metrics.max_drawdown)}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('sharpe')}</div>
                    <div className={s.metricValue}>{metrics.sharpe_ratio ?? '--'}</div>
                </div>
                <div className={s.card}>
                    <div className={s.cardLabel}>{t('winRate')}</div>
                    <div className={s.metricValue}>{pct(metrics.win_rate)}</div>
                </div>
            </div>

            <div className={s.sectionTitle}>{t('strategyVsBenchmark')}</div>
            <div className={s.chartWrap}>
                <ResponsiveContainer>
                    <LineChart data={comparison}>
                        <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
                        {periods.map((period, index) => (
                            <ReferenceArea
                                key={`${period.start_date}-${period.end_date}-${index}`}
                                x1={period.start_date}
                                x2={period.end_date}
                                fill="#00e676"
                                fillOpacity={0.07}
                                strokeOpacity={0}
                            />
                        ))}
                        <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} />
                        <YAxis stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                        <Tooltip content={<ResultTooltip />} />
                        <Line type="monotone" dataKey="strategy" stroke="#b388ff" name={t('strategy')} dot={false} strokeWidth={1.5} />
                        <Line type="monotone" dataKey="benchmark" stroke="#00e5ff" name={t('buyHold')} dot={false} strokeWidth={1.5} />
                        <Scatter data={buyMarkers} dataKey="strategy" fill="#00e676" name={t('buySignal')} shape="triangle" />
                        <Scatter data={sellMarkers} dataKey="strategy" fill="#ff3d57" name={t('sellSignal')} shape="diamond" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={s.chartLegend}>
                <span><span className={`${s.legendSwatch} ${s.legendHolding}`} />{t('holdingZone')}</span>
                <span><span className={`${s.legendDot} ${s.legendBuy}`} />{t('buySignal')}</span>
                <span><span className={`${s.legendDot} ${s.legendSell}`} />{t('sellSignal')}</span>
            </div>

            <div className={s.tablesGrid}>
                <div>
                    <div className={s.sectionTitle}>{t('holdingPeriods')}</div>
                    <div className={s.tableWrap}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>{t('start')}</th>
                                    <th>{t('end')}</th>
                                    <th>{t('days')}</th>
                                    <th>{t('return')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period, index) => (
                                    <tr key={`${period.start_date}-${index}`}>
                                        <td>{period.start_date}</td>
                                        <td>{period.end_date}</td>
                                        <td>{period.days}</td>
                                        <td className={period.return_pct >= 0 ? s.positive : s.negative}>
                                            {pct(period.return_pct)}
                                        </td>
                                    </tr>
                                ))}
                                {!periods.length && (
                                    <tr><td colSpan="4" className={s.empty}>{t('noMatchedPeriods')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className={s.sectionTitle}>{t('signals')}</div>
                    <div className={s.tableWrap}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>{t('side')}</th>
                                    <th>{t('date')}</th>
                                    <th>{t('price')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {signals.map((signal, index) => (
                                    <tr key={`${signal.date}-${signal.type}-${index}`}>
                                        <td className={signal.type === 'buy' ? s.buy : s.sell}>
                                            {signal.type === 'buy' ? t('buy') : t('sell')}
                                        </td>
                                        <td>{signal.date}</td>
                                        <td>{money(signal.price)}</td>
                                    </tr>
                                ))}
                                {!signals.length && (
                                    <tr><td colSpan="3" className={s.empty}>{t('noSignals')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className={s.tooltip}>
            <div className={s.tooltipDate}>{label}</div>
            {payload.map(item => (
                <div key={item.dataKey} className={s.tooltipRow}>
                    <span className={item.dataKey === 'strategy' ? s.tooltipStrategy : s.tooltipBenchmark}>
                        {item.name}
                    </span>
                    <span>${money(item.value)}</span>
                </div>
            ))}
        </div>
    );
}

export default FactorResult;
