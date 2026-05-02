// src/components/MetricsPanel.jsx
import React from 'react';

/**
 * 指标展示面板
 * props.metrics: 后端返回的 metrics 对象
 * props.loading: 是否加载中
 */

const metricGroups = [
    {
        title: '📈 收益',
        items: [
            { key: 'total_return', label: '总收益率', unit: '%' },
            { key: 'annual_return', label: '年化收益率', unit: '%' },
            { key: 'recent_1y_return', label: '近一年收益', unit: '%' },
        ],
    },
    {
        title: '⚠️ 风险',
        items: [
            { key: 'annual_volatility', label: '年化波动率', unit: '%' },
            { key: 'max_drawdown', label: '最大回撤', unit: '%' },
            { key: 'max_drawdown_duration_days', label: '回撤持续', unit: '天' },
        ],
    },
    {
        title: '⚖️ 风险调整收益',
        items: [
            { key: 'sharpe_ratio', label: '夏普比率', unit: '' },
            { key: 'sortino_ratio', label: '索提诺比率', unit: '' },
            { key: 'calmar_ratio', label: 'Calmar 比率', unit: '' },
        ],
    },
    {
        title: '📊 其他',
        items: [
            { key: 'beta', label: 'Beta (vs S&P500)', unit: '' },
            { key: 'trading_days', label: '交易天数', unit: '天' },
        ],
    },
];

function getColor(key, value) {
    if (value == null) return '#999';
    if (['total_return', 'annual_return', 'recent_1y_return'].includes(key)) {
        return value >= 0 ? '#22c55e' : '#ef4444';
    }
    if (key === 'max_drawdown') {
        return '#ef4444';
    }
    if (key === 'sharpe_ratio' || key === 'sortino_ratio' || key === 'calmar_ratio') {
        if (value >= 1) return '#22c55e';
        if (value >= 0.5) return '#eab308';
        return '#ef4444';
    }
    return '#e2e8f0';
}

function formatValue(key, value, unit) {
    if (value == null || value === undefined) return '--';
    if (unit === '%') return `${value > 0 ? '+' : ''}${value}%`;
    if (unit === '天') return `${value} 天`;
    return `${value}`;
}

const styles = {
    container: {
        margin: '16px 0',
        padding: '16px',
        background: '#1a1a2e',
        borderRadius: '10px',
        border: '1px solid #2a2a4a',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    title: {
        color: '#e2e8f0',
        fontSize: '15px',
        fontWeight: 600,
        margin: 0,
    },
    dateRange: {
        color: '#64748b',
        fontSize: '12px',
    },
    groupsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
    },
    group: {
        background: '#16162a',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid #2a2a4a',
    },
    groupTitle: {
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 600,
        marginBottom: '8px',
    },
    metricRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
    },
    metricLabel: {
        color: '#94a3b8',
        fontSize: '13px',
    },
    metricValue: {
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: "'SF Mono', 'Fira Code', monospace",
    },
    loading: {
        color: '#64748b',
        fontSize: '13px',
        textAlign: 'center',
        padding: '20px',
    },
};

function MetricsPanel({ metrics, loading, ticker, range }) {
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>加载指标中...</div>
            </div>
        );
    }

    if (!metrics) return null;

    if (metrics.error) {
        return (
            <div style={styles.container}>
                <div style={{ ...styles.loading, color: '#ef4444' }}>{metrics.error}</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    {ticker} 风险收益指标
                </h3>
                <span style={styles.dateRange}>
                    {metrics.start_date} ~ {metrics.end_date}
                </span>
            </div>

            <div style={styles.groupsContainer}>
                {metricGroups.map(group => (
                    <div key={group.title} style={styles.group}>
                        <div style={styles.groupTitle}>{group.title}</div>
                        {group.items.map(item => {
                            const value = metrics[item.key];
                            if (value === undefined || value === null) {
                                // 跳过不存在的指标（如 ^GSPC 没有 beta）
                                if (item.key === 'beta' && ticker === '^GSPC') return null;
                                if (value === undefined) return null;
                            }
                            return (
                                <div key={item.key} style={styles.metricRow}>
                                    <span style={styles.metricLabel}>{item.label}</span>
                                    <span
                                        style={{
                                            ...styles.metricValue,
                                            color: getColor(item.key, value),
                                        }}
                                    >
                                        {formatValue(item.key, value, item.unit)}
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