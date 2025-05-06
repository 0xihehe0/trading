import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import ChartControls from './components/ChartControls';
import SignalChart from './components/SignalChart';
import BackTestChart from './components/BackTestChart';

import {
  DEFAULT_RANGE,
  DEFAULT_STRATEGY
} from './config/defaults';

import { maRecommendations } from './config/constants';
import { getStockData } from './api/stock';
import { getStrategySignals } from './api/strategy';
import { getSymbolList } from './api/symbols';
import { getBackTest } from './api/backtest';

function App() {
  const [ticker, setTicker] = useState(null); // ❗ 初始为空，等 symbols 加载后再设
  const [symbolList, setSymbolList] = useState([]);
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
  const [selectedMAs, setSelectedMAs] = useState(maRecommendations[DEFAULT_RANGE] || []);
  const [chartData, setChartData] = useState([]);
  const [backTestData, setBackTestData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strategyRequested, setStrategyRequested] = useState(false);

  // 1️⃣ 页面加载后获取 symbols 列表，并设置默认 ticker
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const list = await getSymbolList();
        setSymbolList(list);
        if (list.length > 0) {
          setTicker(list[0].value); // ✅ 设置默认 ticker
        }
      } catch (err) {
        console.error('获取 symbols 失败:', err);
      }
    };
    loadSymbols();
  }, []);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setSelectedMAs(maRecommendations[newRange] || []);
  };


  // 3️⃣ ticker 有效后才请求股票数据
  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStockData(ticker, range, selectedMAs);
        setChartData(data);
        setSignals([]);
        setStrategyRequested(false);
      } catch (err) {
        console.error('获取股票数据失败:', err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, range, selectedMAs]);

  // 4️⃣ 策略点击后触发
  const handleRunStrategy = async () => {
    try {
      const result = await getStrategySignals(ticker, range, strategy, {
        short_ma: 50,
        long_ma: 200
      });
      setSignals(result);
      setStrategyRequested(true);
    } catch (err) {
      console.error('策略请求失败:', err);
      setSignals([]);
    }
  };

  const handleRunBackTest = async() =>{
    try{
      const result = await getBackTest(ticker, range, strategy, {
        short_ma: 50,
        long_ma: 200
      },10000,0.01)
      setBackTestData(result);
      
    }catch (err) {
      console.error('回测请求失败:', err);
      setSignals([]);
    }
  }

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

      <SignalChart
        data={chartData}
        signals={signals}
        mas={selectedMAs}
      />

      <hr style={{ margin: '24px 0' }} />
      <BackTestChart data={backTestData}/>
      <div>
        <p>你当前选择的是：<strong>{ticker}</strong>，区间：<strong>{range}</strong></p>
        <p>策略：<strong>{strategy}</strong>，均线：<strong>{selectedMAs.join(', ')}</strong></p>
        {strategyRequested && signals.length > 0 && (
          <>
            <h4>📌 策略信号结果：</h4>
            <ul>
              {signals.map((s, i) => (
                <li key={i}>
                  {s.date} - {s.type === 'buy' ? '🟢 买入' : '🔴 卖出'} @ {s.price}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
