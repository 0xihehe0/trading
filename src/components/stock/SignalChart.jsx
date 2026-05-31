import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, Legend, Scatter, Brush,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useI18n } from '../../config/i18n';
import s from './style/SignalChart.module.css';

const MA_COLORS = ['#1de9b6', '#ff6e40', '#ffd740', '#7c4dff', '#448aff', '#ff3d57'];

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

const CustomLegend = ({ payload, hiddenKeys, onToggle }) => (
    <div className={s.legendWrap}>
        {payload?.map((entry, i) => {
            const hidden = hiddenKeys.includes(entry.dataKey);
            return (
                <span
                    key={i}
                    onClick={() => onToggle(entry.dataKey)}
                    className={`${s.legendItem} ${hidden ? s.legendItemHidden : ''}`}
                    style={{ color: hidden ? undefined : entry.color }}
                >
                    <span
                        className={s.legendDot}
                        style={{ background: entry.color, opacity: hidden ? 0.3 : 1 }}
                    />
                    {entry.value}
                </span>
            );
        })}
    </div>
);

function SignalChart({ data, signals, mas = [] }) {
    const { t } = useI18n();
    const [hiddenKeys, setHiddenKeys] = useState([]);

    const handleToggle = dataKey => {
        setHiddenKeys(prev =>
            prev.includes(dataKey)
                ? prev.filter(k => k !== dataKey)
                : [...prev, dataKey]
        );
    };

    return (
        <ResponsiveContainer width="100%" height={440}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />

                <XAxis
                    dataKey="date"
                    tickFormatter={str => format(parseISO(str), 'MM-dd')}
                    minTickGap={30}
                    stroke="#4a5568"
                    tick={{ fill: '#4a5568', fontSize: 11 }}
                    axisLine={{ stroke: '#1e2a3a' }}
                    tickLine={false}
                />

                <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    stroke="#4a5568"
                    tick={{ fill: '#4a5568', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend hiddenKeys={hiddenKeys} onToggle={handleToggle} />} />

                {!hiddenKeys.includes('close') && (
                    <Line type="monotone" dataKey="close" stroke="#00e5ff" name={t('close')} dot={false} strokeWidth={1.5} />
                )}

                {mas.map((ma, i) => {
                    const key = `ma${ma}`;
                    return !hiddenKeys.includes(key) && (
                        <Line
                            key={key} type="monotone" dataKey={key}
                            stroke={MA_COLORS[i % MA_COLORS.length]}
                            name={`MA${ma}`} dot={false} strokeWidth={1} strokeOpacity={0.8}
                        />
                    );
                })}

                {!hiddenKeys.includes('buy') && (
                    <Scatter data={signals.filter(sig => sig.type === 'buy')} fill="#00e676" name={t('buy')} shape="triangle" />
                )}
                {!hiddenKeys.includes('sell') && (
                    <Scatter data={signals.filter(sig => sig.type === 'sell')} fill="#ff3d57" name={t('sell')} shape="diamond" />
                )}

                <Brush dataKey="date" height={20} stroke="#2a3a4e" fill="#0a0e17" tickFormatter={() => ''} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default SignalChart;
