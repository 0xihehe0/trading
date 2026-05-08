// src/components/common/SectionHeader.jsx
import s from './style/SectionHeader.module.css';

/**
 * 通用分区标题组件
 * 
 * @param {string} title       - 标题文字
 * @param {string} color       - 图标颜色，对应 CSS 变量名，如 "cyan" "purple" "green"
 * @param {boolean} collapsible - 是否支持折叠
 * @param {boolean} collapsed   - 当前折叠状态（仅 collapsible=true 时有效）
 * @param {function} onToggle   - 折叠切换回调（仅 collapsible=true 时有效）
 */
function SectionHeader({ title, color = 'cyan', collapsible = false, collapsed = false, onToggle }) {
    return (
        <div
            className={s.header}
            onClick={collapsible ? onToggle : undefined}
            style={{ cursor: collapsible ? 'pointer' : 'default' }}
        >
            <span className={s.icon} data-color={color}>◆</span>
            <span className={s.title}>{title}</span>
            {collapsible && (
                <span className={s.collapseIcon}>{collapsed ? '▸' : '▾'}</span>
            )}
        </div>
    );
}

export default SectionHeader;