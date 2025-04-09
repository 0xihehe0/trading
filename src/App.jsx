/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-07 22:08:24
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 21:16:35
 * @FilePath: \trading\src\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import StockChart from './StockChart.jsx';
import StockSelector from './components/StockSelector';
import ChartControls from './components/ChartControls';
import React, { useState, useEffect } from 'react';
import {
    DEFAULT_TICKER,
    DEFAULT_RANGE,
    DEFAULT_STRATEGY,
    DEFAULT_MAS
} from './config/defaults';

function App() {
    const [ticker, setTicker] = useState(DEFAULT_TICKER);
    const [range, setRange] = useState(DEFAULT_RANGE);
    const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
    const [selectedMAs, setSelectedMAs] = useState(DEFAULT_MAS);

    useEffect(() => {
        console.log(ticker);
        console.log(selectedMAs);
        console.log(strategy);
    }, [ticker]); // 每次 ticker 变化都会重新触发

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
        </div>
    );
}

export default App;
