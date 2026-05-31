/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2026-05-01 22:22:22
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-02 23:59:53
 * @FilePath: \trading\src\components\Metricspanel.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { useI18n } from '../../config/i18n';
import s from './style/MetricsPanel.module.css';

const metricGroups = [
    { titleKey: 'returns', icon: '↗', items: [
        { key: 'total_return', labelKey: 'totalReturn', unit: '%' },
        { key: 'annual_return', labelKey: 'annualReturn', unit: '%' },
        { key: 'recent_1y_return', labelKey: 'oneYearReturn', unit: '%' },
    ]},
    { titleKey: 'risk', icon: '⚡', items: [
        { key: 'annual_volatility', labelKey: 'volatility', unit: '%' },
        { key: 'max_drawdown', labelKey: 'maxDd', unit: '%' },
        { key: 'max_drawdown_duration_days', labelKey: 'ddDuration', unit: 'd' },
    ]},
    { titleKey: 'riskAdj', icon: '◆', items: [
        { key: 'sharpe_ratio', labelKey: 'sharpe', unit: '' },
        { key: 'sortino_ratio', labelKey: 'sortino', unit: '' },
        { key: 'calmar_ratio', labelKey: 'calmar', unit: '' },
    ]},
    { titleKey: 'other', icon: '●', items: [
        { key: 'beta', labelKey: 'beta', unit: '' },
        { key: 'trading_days', labelKey: 'days', unit: '' },
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
    const { t } = useI18n();

    if (loading) return <div className={s.container}><div className={s.loading}>{t('metricsLoading')}</div></div>;
    if (!metrics) return null;
    if (metrics.error) return <div className={s.container}><div className={s.error}>{metrics.error}</div></div>;

    return (
        <div className={s.container}>
            <div className={s.header}>
                <h3 className={s.title}>
                    <span className={s.titleTicker}>{ticker}</span> {t('riskReturn')}
                </h3>
                <span className={s.dateRange}>{metrics.start_date} → {metrics.end_date}</span>
            </div>
            <div className={s.grid}>
                {metricGroups.map(group => (
                    <div key={group.titleKey} className={s.group}>
                        <div className={s.groupTitle}><span>{group.icon}</span>{t(group.titleKey)}</div>
                        {group.items.map(item => {
                            const value = metrics[item.key];
                            if (item.key === 'beta' && ticker === '^GSPC') return null;
                            if (value === undefined) return null;
                            return (
                                <div key={item.key} className={s.row}>
                                    <span className={s.label}>{t(item.labelKey)}</span>
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
