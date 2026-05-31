import s from './style/FactorBuilder.module.css';
import { useI18n } from '../../config/i18n';

const operators = ['>', '>=', '<', '<=', '==', '!='];

function defaultParams(factor) {
    const params = {};
    for (const item of factor?.params || []) {
        params[item.key] = item.default;
    }
    return params;
}

function makeCondition(factor) {
    return {
        factor: factor?.name || '',
        operator: factor?.default_operator || '>',
        value: factor?.default_value ?? 0,
        params: defaultParams(factor),
    };
}

function FactorBuilder({
    factors = [],
    templates = [],
    template,
    conditions,
    title,
    showTemplate = true,
    onTemplateChange,
    onConditionsChange,
}) {
    const { t, factorLabel, templateLabel, factorParamLabel } = useI18n();
    const supportedTemplates = templates.filter(item => item.supported);
    const factorMap = Object.fromEntries(factors.map(item => [item.name, item]));

    const updateCondition = (index, patch) => {
        const next = conditions.map((item, i) => i === index ? { ...item, ...patch } : item);
        onConditionsChange(next);
    };

    const updateFactor = (index, factorName) => {
        const nextFactor = factorMap[factorName];
        updateCondition(index, makeCondition(nextFactor));
    };

    const updateParam = (index, key, value) => {
        const current = conditions[index];
        updateCondition(index, {
            params: {
                ...(current.params || {}),
                [key]: value,
            },
        });
    };

    const addCondition = () => {
        if (!factors.length) return;
        onConditionsChange([...conditions, makeCondition(factors[0])]);
    };

    const removeCondition = index => {
        if (conditions.length <= 1) return;
        onConditionsChange(conditions.filter((_, i) => i !== index));
    };

    return (
        <div className={s.container}>
            {title && showTemplate && <div className={s.builderTitle}>{title}</div>}
            <div className={s.topRow}>
                {showTemplate ? (
                    <label className={s.field}>
                        <span className={s.label}>{t('template')}</span>
                        <select
                            className={s.select}
                            value={template}
                            onChange={event => onTemplateChange(event.target.value)}
                        >
                            <option value="custom">{t('custom')}</option>
                            {supportedTemplates.map(item => (
                                <option key={item.name} value={item.name}>
                                    {templateLabel(item.name)}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <div className={s.groupTitle}>{title}</div>
                )}

                <button className={s.addBtn} type="button" onClick={addCondition}>
                    {t('addCondition')}
                </button>
            </div>

            <div className={s.conditionList}>
                {conditions.map((condition, index) => {
                    const factor = factorMap[condition.factor] || factors[0];
                    const params = factor?.params || [];

                    return (
                        <div className={s.conditionRow} key={`${condition.factor}-${index}`}>
                            <div className={s.rowIndex}>{String(index + 1).padStart(2, '0')}</div>

                            <label className={s.field}>
                                <span className={s.label}>{t('factor')}</span>
                                <select
                                    className={s.select}
                                    value={condition.factor}
                                    onChange={event => updateFactor(index, event.target.value)}
                                >
                                    {factors.map(item => (
                                        <option key={item.name} value={item.name}>
                                            {factorLabel(item.name)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {params.map(param => (
                                <label className={`${s.field} ${s.paramField}`} key={param.key}>
                                    <span className={s.label}>{factorParamLabel(condition.factor, param.key, param.label)}</span>
                                    <input
                                        className={s.input}
                                        type="number"
                                        min={param.min}
                                        max={param.max}
                                        value={(condition.params || {})[param.key] ?? param.default}
                                        onChange={event => updateParam(index, param.key, event.target.value)}
                                    />
                                </label>
                            ))}

                            <label className={`${s.field} ${s.operatorField}`}>
                                <span className={s.label}>{t('operator')}</span>
                                <select
                                    className={s.select}
                                    value={condition.operator}
                                    onChange={event => updateCondition(index, { operator: event.target.value })}
                                >
                                    {operators.map(op => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                            </label>

                            <label className={`${s.field} ${s.valueField}`}>
                                <span className={s.label}>{t('value')}</span>
                                <input
                                    className={s.input}
                                    type="number"
                                    step="0.01"
                                    value={condition.value}
                                    onChange={event => updateCondition(index, { value: event.target.value })}
                                />
                            </label>

                            <button
                                className={s.removeBtn}
                                type="button"
                                disabled={conditions.length <= 1}
                                onClick={() => removeCondition(index)}
                                title={t('removeCondition')}
                            >
                                x
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export { makeCondition };
export default FactorBuilder;
