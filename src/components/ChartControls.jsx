/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:51:02
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-11 23:00:28
 * @FilePath: \trading\src\components\ChartControls.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import {
  ranges,
  maRecommendations,
  strategies,
  allMAOptions
} from '../config/constants';

function ChartControls({
  range,
  onRangeChange,
  selectedMAs,
  setSelectedMAs,
  strategy,
  onStrategyChange
}) {
  const toggleMA = (maValue) => {
    const isActive = selectedMAs.includes(maValue);
    const recommended = maRecommendations[range] || [];
    const isValid = recommended.includes(maValue);

    if (!isValid) {
      alert(`当前区间 (${range}) 不推荐使用 MA${maValue}`);
      return;
    }

    const updated = isActive
      ? selectedMAs.filter(v => v !== maValue)
      : [...selectedMAs, maValue];
    setSelectedMAs(updated);
  };

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
              borderRadius: '4px'
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 策略选择 */}
      <div style={{ marginBottom: 8 }}>
        <strong>策略选择：</strong>
        <select value={strategy} onChange={(e) => onStrategyChange(e.target.value)}>
          {strategies.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* 均线选择 */}
      <div style={{ marginBottom: 8 }}>
        <strong>均线选择：</strong>
        {allMAOptions.map(ma => {
          const isSelected = selectedMAs.includes(ma.value);
          const isDisabled = !(maRecommendations[range] || []).includes(ma.value);

          return (
            <button
              key={ma.value}
              onClick={() => toggleMA(ma.value)}
              disabled={isDisabled}
              style={{
                marginRight: 6,
                padding: '4px 8px',
                backgroundColor: isSelected ? '#00b894' : '#eee',
                color: isDisabled ? '#aaa' : isSelected ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {ma.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChartControls;
