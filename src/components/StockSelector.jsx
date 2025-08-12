/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:20:50
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-08-12 23:37:50
 * @FilePath: \trading\src\components\StockSelector.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
