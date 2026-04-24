import { ranges, strategies, allMAOptions } from '../config/constants';

function ChartControls({
    range,
    onRangeChange,
    selectedMAs,
    setSelectedMAs,
    strategy,
    onStrategyChange,
    // 新增/沿用的 props
    canUpdate = false,
    isLatest = false,
    lastLocal,
    loading = false,
    onUpdate
}) {
    const toggleMA = maValue => {
        const updated = selectedMAs.includes(maValue)
            ? selectedMAs.filter(v => v !== maValue)
            : [...selectedMAs, maValue];
        setSelectedMAs(updated);
    };

    return (
        <div style={{ marginBottom: 16 }}>
            {/* 区间选择 */}
            <div style={{ marginBottom: 8 }}>
                <strong>区间选择：</strong>
                {ranges.map(r => (
                    <button
                        key={r.value}
                        onClick={() => onRangeChange(r.value)}
                        style={{
                            marginRight: 6,
                            padding: '4px 10px',
                            backgroundColor:
                                r.value === range ? '#6366f1' : '#eee',
                            color: r.value === range ? '#fff' : '#333',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* 策略选择 */}
            <div style={{ marginBottom: 8 }}>
                <strong>策略选择：</strong>
                <select
                    value={strategy}
                    onChange={e => onStrategyChange(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px' }}
                >
                    {strategies.map(s => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 均线选择 */}
            <div style={{ marginBottom: 8 }}>
                <strong>均线选择：</strong>
                {allMAOptions.map(ma => {
                    const isSelected = selectedMAs.includes(ma.value);
                    return (
                        <button
                            key={ma.value}
                            onClick={() => toggleMA(ma.value)}
                            style={{
                                marginRight: 6,
                                padding: '4px 8px',
                                backgroundColor: isSelected
                                    ? '#00b894'
                                    : '#eee',
                                color: isSelected ? '#fff' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {ma.label}
                        </button>
                    );
                })}
            </div>

            {/* 手动更新 */}
            <div style={{ marginTop: 8 }}>
                <strong>最新状态：</strong>
                <span style={{ marginLeft: 6, marginRight: 10 }}>
                    {isLatest ? '已是最新 ✅' : '可能过期 ⏳'}
                    {lastLocal ? `（本地最后日期：${lastLocal}）` : ''}
                </span>
                <button
                    onClick={onUpdate}
                    disabled={!canUpdate || loading}
                    style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        border: 'none',
                        background: !canUpdate || loading ? '#ddd' : '#10b981',
                        color: '#fff',
                        cursor:
                            !canUpdate || loading ? 'not-allowed' : 'pointer'
                    }}
                    title={isLatest ? '已是最新，无需更新' : '点击更新最新数据'}
                >
                    {loading ? '更新中…' : '▶️ 更新最新'}
                </button>
            </div>
        </div>
    );
}

export default ChartControls;
