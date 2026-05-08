/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:20:50
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-05 15:53:57
 * @FilePath: \trading\src\components\StockSelector.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Select from 'react-select';
import styles from './style/StockSelector.module.css';

// react-select 要求 JS 对象格式的样式，无法用 CSS Modules
// 但颜色引用 CSS 变量保持统一
const selectStyles = {
    control: (base, state) => ({
        ...base,
        background: 'var(--bg-input)',
        borderColor: state.isFocused ? 'var(--color-cyan)' : 'var(--bg-border)',
        borderRadius: 'var(--radius-md)',
        minHeight: '36px',
        boxShadow: state.isFocused ? '0 0 0 1px rgba(0,229,255,0.25)' : 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--font-size-md)',
        '&:hover': { borderColor: 'var(--bg-border-light)' },
    }),
    menu: base => ({
        ...base,
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-border)',
        borderRadius: 'var(--radius-md)',
        zIndex: 100,
    }),
    option: (base, state) => ({
        ...base,
        background: state.isFocused ? 'var(--bg-card-hover)' : 'transparent',
        color: state.isSelected ? 'var(--color-cyan)' : 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--font-size-md)',
        padding: '8px 12px',
        cursor: 'pointer',
        '&:active': { background: 'var(--bg-border-light)' },
    }),
    singleValue: base => ({ ...base, color: 'var(--color-cyan)', fontWeight: 600 }),
    input: base => ({ ...base, color: 'var(--text-primary)' }),
    placeholder: base => ({ ...base, color: 'var(--text-muted)' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: base => ({
        ...base,
        color: 'var(--text-muted)',
        '&:hover': { color: 'var(--text-secondary)' },
    }),
    noOptionsMessage: base => ({ ...base, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }),
    loadingMessage: base => ({ ...base, color: 'var(--text-muted)' }),
};

function StockSelector({ ticker, onChange, options = [] }) {
    const loading = options.length === 0;
    const selectedOption = options.find(opt => opt.value === ticker);

    return (
        <div className={styles.container}>
            <label className={styles.label}>Symbol</label>
            <Select
                options={options}
                value={selectedOption || null}
                onChange={selected => onChange(selected.value)}
                placeholder={loading ? '加载中...' : '搜索代码或名称'}
                isSearchable
                isLoading={loading}
                noOptionsMessage={() => loading ? '加载中...' : '无匹配项'}
                styles={selectStyles}
            />
        </div>
    );
}

export default StockSelector;