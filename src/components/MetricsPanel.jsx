/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2026-05-01 22:22:22
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-02 23:59:53
 * @FilePath: \trading\src\components\Metricspanel.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import s from './style/MetricsPanel.module.css';

const metricGroups = [
    { title: 'RETURNS', icon: '↗', items: [
        { key: 'total_return', label: 'Total Return', unit: '%' },
        { key: 'annual_return', label: 'Ann. Return', unit: '%' },
        { key: 'recent_1y_return', label: '1Y Return', unit: '%' },
    ]},
    { title: 'RISK', icon: '⚡', items: [
        { key: 'annual_volatility', label: 'Volatility', unit: '%' },
        { key: 'max_drawdown', label: 'Max DD', unit: '%' },
        { key: 'max_drawdown_duration_days', label: 'DD Duration', unit: 'd' },
    ]},
    { title: 'RISK-ADJ', icon: '◆', items: [
        { key: 'sharpe_ratio', label: 'Sharpe', unit: '' },
        { key: 'sortino_ratio', label: 'Sortino', unit: '' },
        { key: 'calmar_ratio', label: 'Calmar', unit: '' },
    ]},
    { title: 'OTHER', icon: '●', items: [
        { key: 'beta', label: 'Beta', unit: '' },
        { key: 'trading_days', label: 'Days', unit: '' },
    ]},
];

function getColorClass(key, value) {
    if (value == null) return s.neutral;
    if (['total_return', 'annual_return', 'recent_1y_return'].includes(key))
        return value >= 0 ? s.positive : s.negative;
    if (key === 'max_drawdown') return s.negative;
    if (['sharpe_ratio', 'sortino_ratio', 'calmar_ratio'].includes(key)) {
        if (value >= 1) return s.positive;
        if (value >= 0.5) return s.warning;
        return s.negative;
    }
    return s.neutral;
}

function fmt(key, value, unit) {
    if (value == null) return '--';
    if (unit === '%') return `${value > 0 ? '+' : ''}${value}%`;
    if (unit === 'd') return `${value}d`;
    return `${value}`;
}

function MetricsPanel({ metrics, loading, ticker }) {
    if (loading) return <div className={s.container}><div className={s.loading}>Loading metrics...</div></div>;
    if (!metrics) return null;
    if (metrics.error) return <div className={s.container}><div className={s.error}>{metrics.error}</div></div>;

    return (
        <div className={s.container}>
            <div className={s.header}>
                <h3 className={s.title}>
                    <span className={s.titleTicker}>{ticker}</span> Risk / Return
                </h3>
                <span className={s.dateRange}>{metrics.start_date} → {metrics.end_date}</span>
            </div>
            <div className={s.grid}>
                {metricGroups.map(group => (
                    <div key={group.title} className={s.group}>
                        <div className={s.groupTitle}><span>{group.icon}</span>{group.title}</div>
                        {group.items.map(item => {
                            const value = metrics[item.key];
                            if (item.key === 'beta' && ticker === '^GSPC') return null;
                            if (value === undefined) return null;
                            return (
                                <div key={item.key} className={s.row}>
                                    <span className={s.label}>{item.label}</span>
                                    <span className={`${s.value} ${getColorClass(item.key, value)}`}>
                                        {fmt(item.key, value, item.unit)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MetricsPanel;