// src/components/MarketOverview.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getMarketOverview } from '../../api/market';
import RangeSelector from '../common/RangeSelector';
import { useI18n } from '../../config/i18n';
import s from './style/MarketOverview.module.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
        }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </div>
            ))}
        </div>
    );
};

function MarketOverview() {
    const { t, translateValue } = useI18n();
    const [range, setRange] = useState('6mo');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const result = await getMarketOverview(range);
                setData(result);
            } catch (err) {
                console.error('市场数据获取失败:', err);
                setData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [range]);

    if (loading) return <div className={s.loading}>{t('loadingMarket')}</div>;
    if (!data) return null;

    const sp = data.sp500?.stats || {};
    const vix = data.vix?.stats || {};
    const fng = data.fear_greed?.stats || {};

    const spColor = (sp.change_pct || 0) >= 0 ? s.positive : s.negative;
    const vixColor = vix.current >= 25 ? s.negative : vix.current >= 20 ? s.warning : s.positive;

    const fngColor = (fng.current || 50) <= 25 ? s.negative
        : (fng.current || 50) <= 45 ? s.warning
        : (fng.current || 50) <= 55 ? s.neutral
        : (fng.current || 50) <= 75 ? s.positive
        : s.positive;

    return (
        <div className={s.container}>
            <RangeSelector range={range} onChange={setRange} />

            {/* 三张卡片 */}
            <div className={s.cardsRow} style={{ marginTop: 'var(--spacing-lg)' }}>
                {/* S&P 500 */}
                <div className={s.card}>
                    <div className={s.cardHeader}>
                        <span className={s.cardTitle}>S&P 500</span>
                        <span className={s.cardDate}>{sp.last_date}</span>
                    </div>
                    <div className={`${s.cardValue} ${s.cyan}`}>
                        {sp.current?.toLocaleString()}
                    </div>
                    <div className={`${s.cardChange} ${spColor}`}>
                        {sp.change > 0 ? '+' : ''}{sp.change}
                        {' '}({sp.change_pct > 0 ? '+' : ''}{sp.change_pct}%)
                    </div>
                    <div className={s.cardRange}>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('high')}</span>
                            <span className={s.positive}>{sp.high?.toLocaleString()}</span>
                        </span>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('low')}</span>
                            <span className={s.negative}>{sp.low?.toLocaleString()}</span>
                        </span>
                    </div>
                </div>

                {/* VIX */}
                <div className={s.card}>
                    <div className={s.cardHeader}>
                        <span className={s.cardTitle}>VIX</span>
                        <span className={s.cardDate}>{vix.last_date}</span>
                    </div>
                    <div className={`${s.cardValue} ${vixColor}`}>
                        {vix.current}
                    </div>
                    <div className={`${s.cardStatus} ${vixColor}`}>
                        {translateValue(vix.status)}
                    </div>
                    <div className={s.cardRange}>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('high')}</span>
                            <span className={s.negative}>{vix.high}</span>
                        </span>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('low')}</span>
                            <span className={s.positive}>{vix.low}</span>
                        </span>
                    </div>
                </div>

                {/* Fear & Greed */}
                <div className={s.card}>
                    <div className={s.cardHeader}>
                        <span className={s.cardTitle}>{t('factorFearGreed')}</span>
                        <span className={s.cardDate}>{fng.last_date}</span>
                    </div>
                    <div className={`${s.cardValue} ${fngColor}`}>
                        {fng.current}
                    </div>
                    <div className={`${s.cardStatus} ${fngColor}`}>
                        {translateValue(fng.label)}
                    </div>
                    {/* 仪表条 */}
                    <div className={s.fngGauge}>
                        <div className={s.fngMarker} style={{ left: `${fng.current || 50}%` }} />
                    </div>
                    <div className={s.cardRange}>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('high')}</span>
                            <span>{fng.high}</span>
                        </span>
                        <span className={s.cardRangeItem}>
                            <span className={s.cardRangeLabel}>{t('low')}</span>
                            <span>{fng.low}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <div className={s.chartsGrid}>
                {/* S&P 500 走势 */}
                <div className={`${s.chartCard} ${s.chartCardFull}`}>
                    <div className={s.chartTitle}>S&P 500 - {t('price')}</div>
                    <div className={s.chartWrap}>
                        <ResponsiveContainer>
                            <LineChart data={data.sp500?.chart || []}>
                                <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} />
                                <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} axisLine={false} width={65} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="close" stroke="#00e5ff" name="S&P 500" dot={false} strokeWidth={1.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* VIX 走势 */}
                <div className={s.chartCard}>
                    <div className={s.chartTitle}>VIX - {t('volatility')}</div>
                    <div className={s.chartWrap}>
                        <ResponsiveContainer>
                            <LineChart data={data.vix?.chart || []}>
                                <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={20} stroke="#ffb300" strokeDasharray="3 3" label={{ value: '20', fill: '#ffb300', fontSize: 10 }} />
                                <ReferenceLine y={30} stroke="#ff3d57" strokeDasharray="3 3" label={{ value: '30', fill: '#ff3d57', fontSize: 10 }} />
                                <Line type="monotone" dataKey="close" stroke="#ff9100" name="VIX" dot={false} strokeWidth={1.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fear & Greed 走势 */}
                <div className={s.chartCard}>
                    <div className={s.chartTitle}>CNN {t('factorFearGreed')} {t('index')}</div>
                    <div className={s.chartWrap}>
                        <ResponsiveContainer>
                            <LineChart data={data.fear_greed?.chart || []}>
                                <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} />
                                <YAxis domain={[0, 100]} stroke="#4a5568" tick={{ fill: '#4a5568', fontSize: 11 }} tickLine={false} axisLine={false} width={35} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={25} stroke="#ff3d57" strokeDasharray="3 3" />
                                <ReferenceLine y={50} stroke="#4a5568" strokeDasharray="3 3" />
                                <ReferenceLine y={75} stroke="#00e676" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="value" stroke="#b388ff" name={t('factorFearGreed')} dot={false} strokeWidth={1.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketOverview;
