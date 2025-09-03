import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import ChartControls from './components/ChartControls';
import SignalChart from './components/SignalChart';
import BackTestChart from './components/BackTestChart';

import { DEFAULT_RANGE, DEFAULT_STRATEGY } from './config/defaults';
import { maRecommendations } from './config/constants';
import { getStockData, postNewdata } from './api/stock';   // ✅ 引入 postNewdata
import { getStrategySignals } from './api/strategy';
import { getSymbolList } from './api/symbols';
import { getBackTest } from './api/backtest';

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
  const [meta, setMeta] = useState(null); // ✅ 保存后端 meta

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

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setSelectedMAs(maRecommendations[newRange] || []);
  };

  // 2) 载入行情
  useEffect(() => {
    if (!ticker) return;
    (async () => {
      try {
        setLoading(true);
        const resp = await getStockData(ticker, range, selectedMAs);
        setChartData(resp.data);
        setMeta(resp.meta);
        setSignals([]);
        setStrategyRequested(false);
      } catch (err) {
        console.error('获取股票数据失败:', err);
        setChartData([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [ticker, range, selectedMAs]);

  // 3) 手动更新：调用新接口 /newstock，然后立即刷新图表
  const handleRunUpdate = async () => {
    if (!ticker) return;
    try {
      setLoading(true);

      const updated = await postNewdata(ticker, meta?.last_local);

      // 后端理想返回：{ data, meta } —— 直接刷新
      if (updated?.data && updated?.meta) {
        setChartData(updated.data);
        setMeta(updated.meta);
      } else {
        // 若后端只回 meta，则兜底再拉一次 /stock
        const resp = await getStockData(ticker, range, selectedMAs);
        setChartData(resp.data);
        setMeta(resp.meta);
      }

      setSignals([]);
      setStrategyRequested(false);
    } catch (err) {
      console.error('手动更新失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4) 策略/回测不变
  const handleRunStrategy = async () => {
    try {
      const result = await getStrategySignals(ticker, range, strategy, {
        short_ma: 50, long_ma: 200
      });
      setSignals(result);
      setStrategyRequested(true);
    } catch (err) {
      console.error('策略请求失败:', err);
      setSignals([]);
    }
  };

  const handleRunBackTest = async () => {
    try {
      const result = await getBackTest(ticker, range, strategy, {
        short_ma: 50, long_ma: 200
      }, 10000, 0.01);
      setBackTestData(result);
    } catch (err) {
      console.error('回测请求失败:', err);
      setBackTestData([]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📈 股票价格可视化</h2>

      <StockSelector ticker={ticker} onChange={setTicker} options={symbolList} />

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
        onUpdate={handleRunUpdate}   // ✅ 用新增接口更新
      />

      <button onClick={handleRunStrategy} style={{ margin: '12px 0' }} disabled={!ticker || loading}>
        ▶️ 运行策略分析
      </button>
      <button onClick={handleRunBackTest} style={{ margin: '12px 0' }} disabled={!ticker || loading}>
        ▶️ 测试回测
      </button>

      <SignalChart data={chartData} signals={signals} mas={selectedMAs} />
      <hr style={{ margin: '24px 0' }} />
      <BackTestChart data={backTestData} />

      <div>
        <p>你当前选择的是：<strong>{ticker}</strong>，区间：<strong>{range}</strong></p>
        <p>策略：<strong>{strategy}</strong>，均线：<strong>{selectedMAs.join(', ')}</strong></p>
        {meta?.note && <p style={{ color: '#888' }}>提示：{meta.note}</p>}
      </div>
    </div>
  );
}

export default App;
