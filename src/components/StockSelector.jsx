import React from 'react';
import Select from 'react-select';

function StockSelector({ ticker, onChange }) {
  // 本地 options，后期可替换成 API 调用
  const tickerOptions = [
    { label: 'Apple (AAPL)', value: 'AAPL' },
    { label: 'Microsoft (MSFT)', value: 'MSFT' },
    { label: 'Amazon (AMZN)', value: 'AMZN' },
    { label: 'Nvidia (NVDA)', value: 'NVDA' },
    { label: 'Google (GOOGL)', value: 'GOOGL' },
    { label: 'S&P 500 (^GSPC)', value: '^GSPC' }
  ];

  const selectedOption = tickerOptions.find(opt => opt.value === ticker);

  return (
    <div style={{ marginBottom: '12px', maxWidth: 300 }}>
      <label style={{ marginBottom: '6px', display: 'inline-block' }}>选择股票：</label>
      <Select
        options={tickerOptions}
        value={selectedOption}
        onChange={(selected) => onChange(selected.value)}
        placeholder="搜索股票代码或名称"
        isSearchable
      />
    </div>
  );
}

export default StockSelector;
