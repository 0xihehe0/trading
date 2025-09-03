/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:51:02
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-09-03 22:21:09
 * @FilePath: \trading\src\components\ChartControls.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import {
  ranges,
  strategies,
  allMAOptions
} from '../config/constants';

function ChartControls({
  range,
  onRangeChange,
  selectedMAs,
  setSelectedMAs,
  strategy,
  onStrategyChange,
  canUpdate = false,
  isLatest = false,
  lastLocal,
  loading = false,
  onUpdate,
  meta
}) {
  const toggleMA = (maValue) => {
    const updated = selectedMAs.includes(maValue)
      ? selectedMAs.filter(v => v !== maValue)
      : [...selectedMAs, maValue];
    setSelectedMAs(updated);
  };

  const handleRunUpdate = ()=>{}

  return (
    <div style={{ marginBottom: 16 }}>
      {/* 时间区间选择 */}
      <div style={{ marginBottom: 8 }}>
        <strong>区间选择：</strong>
        {ranges.map(r => (
          <button
            key={r.value}
            onClick={() => onRangeChange(r.value)}
            style={{
              marginRight: 6,
              padding: '4px 10px',
              backgroundColor: r.value === range ? '#6366f1' : '#eee',
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
          onChange={(e) => onStrategyChange(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: '4px' }}
        >
          {strategies.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 均线选择（全部按钮都可点） */}
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
                backgroundColor: isSelected ? '#00b894' : '#eee',
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
      <div style={{ marginBottom: 16 }}>
      {/* 时间区间 */}
      {/* ...保留你的原样... */}

      {/* 均线选择 */}
      {/* ...保留你的原样... */}

      {/* ✅ 更新区 & 状态提示 */}
      <div style={{ marginTop: 8 }}>
        <strong>最新状态：</strong>
        <span style={{ marginRight: 10 }}>
          {isLatest ? '已是最新 ✅' : '可能过期 ⏳'}
          {lastLocal ? `（本地最后日期：${lastLocal}）` : null}
        </span>
        <button
          onClick={handleRunUpdate}
          style={{ marginLeft: 8, padding: '4px 10px', cursor: canUpdate && !loading ? 'pointer' : 'not-allowed' }}
          disabled={!onUpdate.need_update || loading}
          title={canUpdate ? '点击更新至最新' : '当前无可更新或已是最新'}
        >
          ▶️ 更新最新
        </button>
      </div>
    </div>
    </div>
  );
}

export default ChartControls;
