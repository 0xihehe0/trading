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

function App() {
    const [ticker, setTicker] = useState(null);
    const [symbolList, setSymbolList] = useState([]);
    const [range, setRange] = useState(DEFAULT_RANGE);
    const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
    const [selectedMAs, setSelectedMAs] = useState(
        maRecommendations[DEFAULT_RANGE] || []
    );
    const [chartData, setChartData] = useState([]);
    const [backTestData, setBackTestData] = useState([]);
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [strategyRequested, setStrategyRequested] = useState(false);
    const [meta, setMeta] = useState(null);

    // 指标相关状态
    const [metrics, setMetrics] = useState(null);
    const [metricsLoading, setMetricsLoading] = useState(false);

    // 1) 载入 symbols
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

    // 2) 载入行情 + 指标（ticker 或 range 变化时同时请求）
    useEffect(() => {
        if (!ticker) return;
        (async () => {
            try {
                setLoading(true);
                setMetricsLoading(true);

                // 并行请求行情和指标
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

    // 3) 手动更新
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

            // 更新数据后重新拉指标
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

    // 4) 策略/回测
    const handleRunStrategy = async () => {
        if (selectedMAs.length < 2) {
            alert('请至少选择两条均线用于策略分析');
            return;
        }
        const shortMA = Math.min(...selectedMAs);
        const longMA = Math.max(...selectedMAs);
        try {
            const result = await getStrategySignals(ticker, range, strategy, {
                short_ma: shortMA,
                long_ma: longMA
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
        const shortMA = Math.min(...selectedMAs);
        const longMA = Math.max(...selectedMAs);
        try {
            const result = await getBackTest(
                ticker,
                range,
                strategy,
                { short_ma: shortMA, long_ma: longMA },
                10000,
                0.01
            );
            setBackTestData(result);
        } catch (err) {
            console.error('回测请求失败:', err);
            setBackTestData([]);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>📈 股票价格可视化</h2>

            <StockSelector
                ticker={ticker}
                onChange={setTicker}
                options={symbolList}
            />

            <ChartControls
                range={range}
                onRangeChange={handleRangeChange}
                selectedMAs={selectedMAs}
                setSelectedMAs={setSelectedMAs}
                strategy={strategy}
                onStrategyChange={setStrategy}
                canUpdate={!!meta && !!meta.need_update}
                isLatest={!!meta && !!meta.is_latest}
                lastLocal={meta?.last_local}
                loading={loading}
                onUpdate={handleRunUpdate}
            />

            <button
                onClick={handleRunStrategy}
                style={{ margin: '12px 0' }}
                disabled={!ticker || loading}
            >
                ▶️ 运行策略分析
            </button>
            <button
                onClick={handleRunBackTest}
                style={{ margin: '12px 0' }}
                disabled={!ticker || loading}
            >
                ▶️ 测试回测
            </button>

            <SignalChart data={chartData} signals={signals} mas={selectedMAs} />

            <MetricsPanel
                metrics={metrics}
                loading={metricsLoading}
                ticker={ticker}
                range={range}
            />

            <hr style={{ margin: '24px 0' }} />
            <BackTestChart data={backTestData} />

            <div>
                <p>
                    你当前选择的是：<strong>{ticker}</strong>，区间：
                    <strong>{range}</strong>
                </p>
                <p>
                    策略：<strong>{strategy}</strong>，均线：
                    <strong>{selectedMAs.join(', ')}</strong>
                </p>
                {meta?.note && (
                    <p style={{ color: '#888' }}>提示：{meta.note}</p>
                )}
            </div>
        </div>
    );
}

export default App;