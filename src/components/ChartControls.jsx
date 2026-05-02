/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:51:02
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-02 23:59:06
 * @FilePath: \trading\src\components\ChartControls.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ranges, strategies, allMAOptions } from '../config/constants';
import styles from './style/ChartControls.module.css';

function ChartControls({
    range, onRangeChange,
    selectedMAs, setSelectedMAs,
    strategy, onStrategyChange,
    canUpdate = false, isLatest = false,
    lastLocal, loading = false, onUpdate,
}) {
    const toggleMA = maValue => {
        const updated = selectedMAs.includes(maValue)
            ? selectedMAs.filter(v => v !== maValue)
            : [...selectedMAs, maValue];
        setSelectedMAs(updated);
    };

    const syncEnabled = canUpdate && !loading;

    return (
        <div className={styles.container}>
            {/* 区间 */}
            <div className={styles.row}>
                <span className={styles.label}>Range</span>
                <div className={styles.btnGroup}>
                    {ranges.map(r => (
                        <button
                            key={r.value}
                            onClick={() => onRangeChange(r.value)}
                            className={`${styles.btn} ${r.value === range ? styles.btnActive : ''}`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 策略 */}
            <div className={styles.row}>
                <span className={styles.label}>Strategy</span>
                <select
                    value={strategy}
                    onChange={e => onStrategyChange(e.target.value)}
                    className={styles.select}
                >
                    {strategies.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {/* 均线 */}
            <div className={styles.row}>
                <span className={styles.label}>MA</span>
                <div className={styles.maGroup}>
                    {allMAOptions.map(ma => (
                        <button
                            key={ma.value}
                            onClick={() => toggleMA(ma.value)}
                            className={`${styles.maBtn} ${selectedMAs.includes(ma.value) ? styles.maBtnActive : ''}`}
                        >
                            {ma.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 数据状态 */}
            <div className={styles.row}>
                <span className={styles.label}>Status</span>
                <div className={styles.statusContainer}>
                    <div className={`${styles.statusDot} ${isLatest ? styles.statusDotLive : styles.statusDotStale}`} />
                    <span className={styles.statusText}>{isLatest ? 'LIVE' : 'STALE'}</span>
                    {lastLocal && <span className={styles.statusDate}>Last: {lastLocal}</span>}
                    <button
                        onClick={onUpdate}
                        disabled={!syncEnabled}
                        className={`${styles.syncBtn} ${syncEnabled ? styles.syncBtnEnabled : styles.syncBtnDisabled}`}
                    >
                        {loading ? 'SYNCING...' : 'SYNC'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChartControls;