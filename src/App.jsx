// src/App.jsx
import React, { useState } from 'react';
import MarketOverview from './components/market/MarketOverview';
import StockAnalysis from './components/stock/StockAnalysis';
import s from './App.module.css';
import SectionHeader from './components/common/SectionHeader';

function App() {
    const [marketCollapsed, setMarketCollapsed] = useState(false);

    return (
        <div className={s.app}>
            {/* Header */}
            <div className={s.header}>
                <h1 className={s.headerTitle}>TERMINAL</h1>
                <span className={s.headerSub}>S&P 500 Analytics Platform</span>
            </div>

            <div className={s.body}>
                {/* ===== 市场总览 ===== */}
                <SectionHeader
                    title="Market Overview"
                    color="cyan"
                    collapsible
                    collapsed={marketCollapsed}
                    onToggle={() => setMarketCollapsed(!marketCollapsed)}
                />
                <div
                    className={`${s.collapsible} ${marketCollapsed ? s.collapsed : ''}`}
                >
                    <MarketOverview />
                </div>

                <hr className={s.divider} />

                {/* ===== 个股分析 ===== */}
                <SectionHeader title="Stock Analysis" color="purple" />
                <StockAnalysis />

                {/* ===== 因子实验室（预留位置）===== */}
            </div>
        </div>
    );
}

export default App;
