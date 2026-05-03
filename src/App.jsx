import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import ChartControls from './components/ChartControls';
import SignalChart from './components/SignalChart';
import BackTestChart from './components/BackTestChart';
import MetricsPanel from './components/MetricsPanel';

import { DEFAULT_RANGE, DEFAULT_STRATEGY } from './config/defaults';
import { maRecommendations } from './config/constants';
import { getStockData, postNewdata } from './api/stock';
import { getStrategySignals } from './api/strategy';
import { getSymbolList } from './api/symbols';
import { getBackTest } from './api/backtest';
import { getStockMetrics } from './api/metrics';

import styles from './module.css';

function App() {
    const [ticker, setTicker] = useState(null);
    const [symbolList, setSymbolList] = useState([]);
    const [range, setRange] = useState(DEFAULT_RANGE);
    const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
    const [selectedMAs, setSelectedMAs] = useState(maRecommendations[DEFAULT_RANGE] || []);
    const [chartData, setChartData] = useState([]);
    const [backTestData, setBackTestData] = useState([]);
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [strategyRequested, setStrategyRequested] = useState(false);
    const [meta, setMeta] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [metricsLoading, setMetricsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const list = await getSymbolList();
                setSymbolList(list);
                if (list.length > 0) setTicker(list[0].value);
            } catch (err) {
                console.error('获取 symbols 失败:', err);
            }
        })();
    }, []);

    const handleRangeChange = newRange => {
        setRange(newRange);
        setSelectedMAs(maRecommendations[newRange] || []);
    };

    useEffect(() => {
        if (!ticker) return;
        (async () => {
            try {
                setLoading(true);
                setMetricsLoading(true);
                const [stockResp, metricsResp] = await Promise.all([
                    getStockData(ticker, range, selectedMAs),
                    getStockMetrics(ticker, range),
                ]);
                setChartData(stockResp.data);
                setMeta(stockResp.meta);
                setMetrics(metricsResp.metrics);
                setSignals([]);
                setStrategyRequested(false);
            } catch (err) {
                console.error('获取数据失败:', err);
                setChartData([]);
                setMeta(null);
                setMetrics(null);
            } finally {
                setLoading(false);
                setMetricsLoading(false);
            }
        })();
    }, [ticker, range, selectedMAs]);

    const handleRunUpdate = async () => {
        if (!ticker) return;
        try {
            setLoading(true);
            const updated = await postNewdata(ticker, meta?.last_local);
            if (updated?.data && updated?.meta) {
                setChartData(updated.data);
                setMeta(updated.meta);
            } else {
                const resp = await getStockData(ticker, range, selectedMAs);
                setChartData(resp.data);
                setMeta(resp.meta);
            }
            try {
                const metricsResp = await getStockMetrics(ticker, range);
                setMetrics(metricsResp.metrics);
            } catch (e) {
                console.error('更新指标失败:', e);
            }
            setSignals([]);
            setStrategyRequested(false);
        } catch (err) {
            console.error('手动更新失败:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRunStrategy = async () => {
        if (selectedMAs.length < 2) {
            alert('请至少选择两条均线用于策略分析');
            return;
        }
        try {
            const result = await getStrategySignals(ticker, range, strategy, {
                short_ma: Math.min(...selectedMAs),
                long_ma: Math.max(...selectedMAs),
            });
            setSignals(result);
            setStrategyRequested(true);
        } catch (err) {
            console.error('策略请求失败:', err);
            setSignals([]);
        }
    };

    const handleRunBackTest = async () => {
        if (selectedMAs.length < 2) {
            alert('请至少选择两条均线用于回测');
            return;
        }
        try {
            const result = await getBackTest(
                ticker, range, strategy,
                { short_ma: Math.min(...selectedMAs), long_ma: Math.max(...selectedMAs) },
                10000, 0.01
            );
            setBackTestData(result);
        } catch (err) {
            console.error('回测请求失败:', err);
            setBackTestData([]);
        }
    };

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>TERMINAL</h1>
                <span className={styles.headerSub}>S&P 500 Analytics Platform</span>
            </div>

            <div className={styles.body}>
                <div className={styles.controlBar}>
                    <StockSelector ticker={ticker} onChange={setTicker} options={symbolList} />
                    <ChartControls
                        range={range} onRangeChange={handleRangeChange}
                        selectedMAs={selectedMAs} setSelectedMAs={setSelectedMAs}
                        strategy={strategy} onStrategyChange={setStrategy}
                        canUpdate={!!meta?.need_update} isLatest={!!meta?.is_latest}
                        lastLocal={meta?.last_local} loading={loading}
                        onUpdate={handleRunUpdate}
                    />
                </div>

                <div className={styles.actionBar}>
                    <button
                        className={`${styles.actionBtn} ${styles.actionBtnStrategy}`}
                        onClick={handleRunStrategy}
                        disabled={!ticker || loading}
                    >
                        ▶ 运行策略分析
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.actionBtnBacktest}`}
                        onClick={handleRunBackTest}
                        disabled={!ticker || loading}
                    >
                        ▶ 测试回测
                    </button>
                </div>

                <div className={styles.chartSection}>
                    <SignalChart data={chartData} signals={signals} mas={selectedMAs} />
                </div>

                <MetricsPanel metrics={metrics} loading={metricsLoading} ticker={ticker} range={range} />
                <BackTestChart data={backTestData} />

                <div className={styles.statusBar}>
                    <span className={styles.statusItem}>
                        <span className={styles.statusLabel}>TICKER</span>
                        <span className={styles.statusValue}>{ticker || '--'}</span>
                    </span>
                    <span className={styles.statusItem}>
                        <span className={styles.statusLabel}>RANGE</span>
                        <span className={styles.statusValue}>{range.toUpperCase()}</span>
                    </span>
                    <span className={styles.statusItem}>
                        <span className={styles.statusLabel}>MA</span>
                        <span className={styles.statusValue}>{selectedMAs.join(' / ') || '--'}</span>
                    </span>
                    <span className={styles.statusItem}>
                        <span className={styles.statusLabel}>STRATEGY</span>
                        <span className={styles.statusValue}>{strategy}</span>
                    </span>
                    {meta?.note && <span className={styles.statusNote}>{meta.note}</span>}
                </div>
            </div>
        </div>
    );
}

export default App;