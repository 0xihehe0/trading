import React from 'react';
import Select from 'react-select';

function StockSelector({ ticker, onChange, options = [] }) {
  const loading = options.length === 0;

  const selectedOption = options.find(opt => opt.value === ticker);

  return (
    <div style={{ marginBottom: '12px', maxWidth: 300 }}>
      <label style={{ marginBottom: '6px', display: 'inline-block' }}>选择股票：</label>
      <Select
        options={options}
        value={selectedOption || null}
        onChange={(selected) => onChange(selected.value)}
        placeholder={loading ? '正在加载股票列表...' : '搜索股票代码或名称'}
        isSearchable
        isLoading={loading}
        noOptionsMessage={() => loading ? '加载中...' : '无匹配项'}
      />
    </div>
  );
}

export default StockSelector;
