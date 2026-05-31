/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2026-05-04 14:01:00
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-05 15:45:29
 * @FilePath: \trading\src\components\RangeSelector.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/components/RangeSelector.jsx
import { ranges } from '../../config/constants';
import { useI18n } from '../../config/i18n';
import styles from './style/RangeSelector.module.css';

function RangeSelector({ range, onChange, label }) {
    const { t } = useI18n();

    return (
        <div className={styles.row}>
            <span className={styles.label}>{label || t('range')}</span>
            <div className={styles.btnGroup}>
                {ranges.map(r => (
                    <button
                        key={r.value}
                        onClick={() => onChange(r.value)}
                        className={`${styles.btn} ${r.value === range ? styles.btnActive : ''}`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RangeSelector;
