import React, { useEffect, useMemo, useState } from 'react';
import { DEFAULT_RANGE } from '../../config/defaults';
import { getFactors, runFactorBacktest } from '../../api/factor';
import { getSymbolList } from '../../api/symbols';
import RangeSelector from '../common/RangeSelector';
import StockSelector from '../stock/StockSelector';
import FactorBuilder, { makeCondition } from './FactorBuilder';
import FactorResult from './FactorResult';
import { useI18n } from '../../config/i18n';
import s from './style/FactorLab.module.css';

function makeExitCondition(factors = []) {
    const rsi = factors.find(item => item.name === 'rsi');
    if (rsi) {
        return {
            factor: 'rsi',
            operator: '>',
            value: 55,
            params: { period: 14 },
        };
    }
    return makeCondition(factors[0]);
}

function FactorLab() {
    const { t } = useI18n();
    const [symbolList, setSymbolList] = useState([]);
    const [ticker, setTicker] = useState(null);
    const [range, setRange] = useState(DEFAULT_RANGE);
    const [catalog, setCatalog] = useState({ factors: [], templates: [] });
    const [template, setTemplate] = useState('custom');
    const [entryConditions, setEntryConditions] = useState([]);
    const [exitConditions, setExitConditions] = useState([]);
    const [minDuration, setMinDuration] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setInitializing(true);
                const [symbols, factorCatalog] = await Promise.all([
                    getSymbolList(),
                    getFactors(),
                ]);

                setSymbolList(symbols);
                setTicker(symbols.find(item => !String(item.value).startsWith('^'))?.value || symbols[0]?.value || null);
                setCatalog(factorCatalog);

                const firstFactor = factorCatalog.factors?.[0];
                if (firstFactor) {
                    setEntryConditions([makeCondition(firstFactor)]);
                    setExitConditions([makeExitCondition(factorCatalog.factors)]);
                }
            } catch (err) {
                console.error('FactorLab init failed:', err);
                setError('factorDataUnavailable');
            } finally {
                setInitializing(false);
            }
        })();
    }, []);

    const templateMap = useMemo(
        () => Object.fromEntries((catalog.templates || []).map(item => [item.name, item])),
        [catalog.templates]
    );

    const handleTemplateChange = nextTemplate => {
        setTemplate(nextTemplate);
        if (nextTemplate === 'custom') return;

        const selected = templateMap[nextTemplate];
        const entry = selected?.entry_conditions || selected?.conditions || [];
        const exit = selected?.exit_conditions || [];
        if (entry.length) {
            setEntryConditions(entry.map(item => ({
                factor: item.factor,
                operator: item.operator,
                value: item.value,
                params: item.params || {},
            })));
            setExitConditions(exit.length ? exit.map(item => ({
                factor: item.factor,
                operator: item.operator,
                value: item.value,
                params: item.params || {},
            })) : [makeExitCondition(catalog.factors)]);
            setResult(null);
        }
    };

    const handleEntryConditionsChange = nextConditions => {
        setEntryConditions(nextConditions);
        setTemplate('custom');
        setResult(null);
    };

    const handleExitConditionsChange = nextConditions => {
        setExitConditions(nextConditions);
        setTemplate('custom');
        setResult(null);
    };

    const handleRun = async () => {
        if (!ticker || !entryConditions.length || !exitConditions.length) return;
        try {
            setLoading(true);
            setError('');
            const response = await runFactorBacktest({
                ticker,
                range,
                entry_conditions: entryConditions,
                exit_conditions: exitConditions,
                initial_capital: 10000,
                commission: 0.001,
                min_duration: minDuration,
            });
            setResult(response);
        } catch (err) {
            console.error('Factor backtest failed:', err);
            setResult(null);
            setError(err.response?.data?.error || 'factorBacktestFailed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <div className={s.controlPanel}>
                <div className={s.selectorGrid}>
                    <StockSelector ticker={ticker} onChange={setTicker} options={symbolList} />
                    <div className={s.rangeBox}>
                        <RangeSelector range={range} onChange={setRange} />
                    </div>
                    <label className={s.durationField}>
                        <span className={s.label}>{t('minDays')}</span>
                        <input
                            className={s.input}
                            type="number"
                            min="1"
                            max="60"
                            value={minDuration}
                            onChange={event => setMinDuration(event.target.value)}
                        />
                    </label>
                </div>

                <FactorBuilder
                    factors={catalog.factors}
                    templates={catalog.templates}
                    template={template}
                    title={t('entryConditions')}
                    conditions={entryConditions}
                    onTemplateChange={handleTemplateChange}
                    onConditionsChange={handleEntryConditionsChange}
                />

                <FactorBuilder
                    factors={catalog.factors}
                    title={t('exitConditions')}
                    showTemplate={false}
                    conditions={exitConditions}
                    onConditionsChange={handleExitConditionsChange}
                />
            </div>

            <div className={s.actionBar}>
                <button
                    className={s.runBtn}
                    type="button"
                    onClick={handleRun}
                    disabled={loading || initializing || !ticker || !entryConditions.length || !exitConditions.length}
                >
                    {loading ? t('running') : t('runFactorBacktest')}
                </button>
                <div className={s.statusLine}>
                    <span className={s.statusLabel}>{t('entry')}</span>
                    <span className={s.statusValue}>{entryConditions.length}</span>
                    <span className={s.statusLabel}>{t('exit')}</span>
                    <span className={s.statusValue}>{exitConditions.length}</span>
                    <span className={s.statusLabel}>{t('logic')}</span>
                    <span className={s.statusValue}>AND</span>
                </div>
            </div>

            {error && <div className={s.error}>{t(error) === error ? error : t(error)}</div>}

            <FactorResult result={result} />
        </div>
    );
}

export default FactorLab;
