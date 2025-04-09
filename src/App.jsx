/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-07 22:08:24
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 22:15:56
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

            <h4>✅ 控制台中打印了返回的股票数据和策略信号</h4>
            <p>
                你当前选择的是：<strong>{ticker}</strong>，区间：
                <strong>{range}</strong>
            </p>
            <p>
                策略：<strong>{strategy}</strong>，均线：
                <strong>{selectedMAs.join(', ')}</strong>
            </p>
        </div>
    );
}

export default App;
