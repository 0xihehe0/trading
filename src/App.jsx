/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-07 22:08:24
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-10 21:36:49
 * @FilePath: \trading\src\App.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import ChartControls from './components/ChartControls';
import SignalChart from './components/SignalChart';
import { maRecommendations } from './config/constants';

import {
    DEFAULT_TICKER,
    DEFAULT_RANGE,
    DEFAULT_STRATEGY,
    DEFAULT_MAS
} from './config/defaults';

import { getStockData } from './api/stock';
import { getStrategySignals } from './api/strategy';

function App() {
    const [ticker, setTicker] = useState(DEFAULT_TICKER);
    const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
    const [range, setRange] = useState(DEFAULT_RANGE);

    const [selectedMAs, setSelectedMAs] = useState(
        maRecommendations[DEFAULT_RANGE]
    );
    const [chartData, setChartData] = useState([]);
    const [signals, setSignals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('📤 请求参数: ', {
                    ticker,
                    range,
                    selectedMAs,
                    strategy
                });

                const [priceData, strategyData] = await Promise.all([
                    getStockData(ticker, range, selectedMAs),
                    getStrategySignals(ticker, range, strategy, {
                        short_ma: 50,
                        long_ma: 200
                    })
                ]);

                console.log('✅ 股票数据: ', priceData);
                console.log('✅ 策略信号: ', strategyData);

                setChartData(priceData);
                setSignals(strategyData);
            } catch (error) {
                console.error('❌ 数据请求失败:', error);
            }
        };

        fetchData();
    }, [ticker, range, selectedMAs, strategy]);

    useEffect(() => {
        const recommended = maRecommendations[range] || [];
        setSelectedMAs(prev => prev.filter(ma => recommended.includes(ma)));
      }, [range]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>📈 股票价格可视化</h2>

            <StockSelector ticker={ticker} onChange={setTicker} />

            <ChartControls
                range={range}
                onRangeChange={setRange}
                selectedMAs={selectedMAs}
                setSelectedMAs={setSelectedMAs}
                strategy={strategy}
                onStrategyChange={setStrategy}
            />
            <SignalChart data={chartData} signals={signals} mas={selectedMAs} />

            <hr />

            {signals.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <h4>策略信号列表（{signals.length} 个）</h4>
                    <ul>
                        {signals.map((s, i) => (
                            <li key={i}>
                                <span>{s.date}</span> -{' '}
                                <strong>
                                    {s.type === 'buy' ? '🟢 买入' : '🔴 卖出'}
                                </strong>{' '}
                                @ {s.price}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
