import React, { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'trading_lang';

const dictionaries = {
    en: {
        appSubtitle: 'S&P 500 Analytics Platform',
        langZh: '中',
        langEn: 'EN',

        marketOverview: 'Market Overview',
        stockAnalysis: 'Stock Analysis',
        factorLab: 'Factor Lab',

        range: 'Range',
        symbol: 'Symbol',
        strategy: 'Strategy',
        status: 'Status',
        last: 'Last',
        live: 'LIVE',
        stale: 'STALE',
        sync: 'SYNC',
        syncing: 'SYNCING...',
        loading: 'Loading...',
        searchSymbol: 'Search symbol or name',
        noMatches: 'No matches',

        high: 'H',
        low: 'L',
        price: 'Price',
        index: 'Index',
        volatility: 'Volatility',
        loadingMarket: 'Loading market data...',

        runStrategy: 'Run Strategy Analysis',
        runBacktest: 'Run Backtest',
        selectTwoMa: 'Please select at least two moving averages',
        ticker: 'TICKER',
        ma: 'MA',

        metricsLoading: 'Loading metrics...',
        riskReturn: 'Risk / Return',
        returns: 'RETURNS',
        risk: 'RISK',
        riskAdj: 'RISK-ADJ',
        other: 'OTHER',
        totalReturn: 'Total Return',
        annualReturn: 'Ann. Return',
        oneYearReturn: '1Y Return',
        maxDd: 'Max DD',
        ddDuration: 'DD Duration',
        days: 'Days',
        beta: 'Beta',
        sharpe: 'Sharpe',
        sortino: 'Sortino',
        calmar: 'Calmar',

        backtestResults: 'Backtest Results',
        initial: 'Initial',
        final: 'Final',
        return: 'Return',
        annReturn: 'Ann. Return',
        winRate: 'Win Rate',
        trades: 'Trades',
        wins: 'Wins',
        losses: 'Losses',
        tradeLog: 'Trade Log',
        date: 'Date',
        side: 'Side',
        shares: 'Shares',
        amount: 'Amount',
        buy: 'Buy',
        sell: 'Sell',
        portfolio: 'Portfolio',
        position: 'Position',
        cash: 'Cash',
        close: 'Close',

        template: 'Template',
        custom: 'Custom',
        addCondition: '+ Add Condition',
        removeCondition: 'Remove condition',
        factor: 'Factor',
        operator: 'Op',
        value: 'Value',
        minDays: 'Min Days',
        runFactorBacktest: 'Run Factor Backtest',
        running: 'Running...',
        factorDataUnavailable: 'Factor data unavailable',
        factorBacktestFailed: 'Factor backtest failed',
        conditions: 'CONDITIONS',
        entry: 'ENTRY',
        exit: 'EXIT',
        entryConditions: 'Entry Conditions',
        exitConditions: 'Exit Conditions',
        logic: 'LOGIC',
        factorResult: 'Factor Result',
        finalCapital: 'Final Capital',
        strategyReturn: 'Strategy Return',
        buyHold: 'Buy & Hold',
        alpha: 'Alpha',
        matchDays: 'Match Days',
        entryDays: 'Entry Days',
        exitDays: 'Exit Days',
        holdingDays: 'Holding Days',
        signals: 'Signals',
        strategyVsBenchmark: 'Strategy vs Benchmark',
        matchedPeriods: 'Matched Periods',
        holdingPeriods: 'Holding Periods',
        buySignal: 'Buy Signal',
        sellSignal: 'Sell Signal',
        holdingZone: 'Holding Zone',
        start: 'Start',
        end: 'End',
        noMatchedPeriods: 'No matched periods',
        noSignals: 'No signals',

        strategyMaCross: 'MA Cross Strategy',
        strategyRsi: 'RSI Strategy',

        panicBottom: 'Panic Bottom',
        trendFollowing: 'Trend Following',
        meanReversion: 'Mean Reversion',
        volatilityContractionBreakout: 'Volatility Contraction Breakout',

        factorPriceVsMa: 'Price vs MA (%)',
        factorMaSpread: 'MA Spread (%)',
        factorRsi: 'RSI',
        factorVix: 'VIX',
        factorFearGreed: 'Fear & Greed',
        factorReturnN: 'N-Day Return (%)',
        factorVolumeRatio: 'Volume Ratio',
        period: 'Period',
        shortPeriod: 'Short MA',
        longPeriod: 'Long MA',
        volumeMa: 'Volume MA',
        lookback: 'Lookback',

        extremelyLow: 'Extremely Low',
        lowStatus: 'Low',
        normal: 'Normal',
        elevated: 'Elevated',
        highStatus: 'High',
        extremeFear: 'Extreme Fear',
        fear: 'Fear',
        neutral: 'Neutral',
        greed: 'Greed',
        extremeGreed: 'Extreme Greed',
        localCache: 'served from local cache (no network)',
    },
    zh: {
        appSubtitle: '标普500量化分析平台',
        langZh: '中',
        langEn: 'EN',

        marketOverview: '市场总览',
        stockAnalysis: '个股分析',
        factorLab: '因子实验室',

        range: '区间',
        symbol: '标的',
        strategy: '策略',
        status: '状态',
        last: '最近',
        live: '最新',
        stale: '待更新',
        sync: '同步',
        syncing: '同步中...',
        loading: '加载中...',
        searchSymbol: '搜索代码或名称',
        noMatches: '无匹配项',

        high: '高',
        lowStatus: '低',
        price: '价格',
        index: '指数',
        volatility: '波动率',
        loadingMarket: '正在加载市场数据...',

        runStrategy: '运行策略分析',
        runBacktest: '运行回测',
        selectTwoMa: '请至少选择两条均线',
        ticker: '标的',
        ma: '均线',

        metricsLoading: '正在加载指标...',
        riskReturn: '风险 / 收益',
        returns: '收益',
        risk: '风险',
        riskAdj: '风险调整',
        other: '其他',
        totalReturn: '总收益',
        annualReturn: '年化收益',
        oneYearReturn: '近1年收益',
        maxDd: '最大回撤',
        ddDuration: '回撤天数',
        days: '天数',
        beta: 'Beta',
        sharpe: '夏普',
        sortino: '索提诺',
        calmar: 'Calmar',

        backtestResults: '回测结果',
        initial: '初始资金',
        final: '最终资金',
        return: '收益',
        annReturn: '年化收益',
        winRate: '胜率',
        trades: '交易数',
        wins: '盈利',
        losses: '亏损',
        tradeLog: '交易记录',
        date: '日期',
        side: '方向',
        shares: '股数',
        amount: '金额',
        buy: '买入',
        sell: '卖出',
        portfolio: '组合',
        position: '持仓',
        cash: '现金',
        close: '收盘',

        template: '模板',
        custom: '自定义',
        addCondition: '+ 添加条件',
        removeCondition: '删除条件',
        factor: '因子',
        operator: '比较',
        value: '阈值',
        minDays: '最少天数',
        runFactorBacktest: '运行因子回测',
        running: '运行中...',
        factorDataUnavailable: '因子数据不可用',
        factorBacktestFailed: '因子回测失败',
        conditions: '条件',
        entry: '买入',
        exit: '卖出',
        entryConditions: '买入条件',
        exitConditions: '卖出条件',
        logic: '逻辑',
        factorResult: '因子结果',
        finalCapital: '最终资金',
        strategyReturn: '策略收益',
        buyHold: '买入持有',
        alpha: '超额收益',
        matchDays: '命中天数',
        entryDays: '买入命中',
        exitDays: '卖出命中',
        holdingDays: '持仓天数',
        signals: '信号',
        strategyVsBenchmark: '策略 vs 买入持有',
        matchedPeriods: '命中区间',
        holdingPeriods: '持仓区间',
        buySignal: '买入信号',
        sellSignal: '卖出信号',
        holdingZone: '持仓区间',
        start: '开始',
        end: '结束',
        noMatchedPeriods: '无命中区间',
        noSignals: '无信号',

        strategyMaCross: '均线交叉策略',
        strategyRsi: 'RSI 相对强弱策略',

        panicBottom: '恐慌抄底',
        trendFollowing: '趋势跟踪',
        meanReversion: '均值回归',
        volatilityContractionBreakout: '波动率收缩突破',

        factorPriceVsMa: '价格 vs 均线 (%)',
        factorMaSpread: '均线差值 (%)',
        factorRsi: 'RSI',
        factorVix: 'VIX',
        factorFearGreed: '恐惧贪婪',
        factorReturnN: 'N日收益率 (%)',
        factorVolumeRatio: '成交量倍数',
        period: '周期',
        shortPeriod: '短均线',
        longPeriod: '长均线',
        volumeMa: '成交量均线',
        lookback: '回看天数',

        extremelyLow: '极低',
        low: '低',
        normal: '正常',
        elevated: '偏高',
        highStatus: '高',
        extremeFear: '极度恐慌',
        fear: '恐慌',
        neutral: '中性',
        greed: '贪婪',
        extremeGreed: '极度贪婪',
        localCache: '来自本地缓存（未联网）',
    },
};

const factorKeys = {
    price_vs_ma: 'factorPriceVsMa',
    ma_spread: 'factorMaSpread',
    rsi: 'factorRsi',
    vix: 'factorVix',
    fear_greed: 'factorFearGreed',
    return_n: 'factorReturnN',
    volume_ratio: 'factorVolumeRatio',
};

const templateKeys = {
    panic_bottom: 'panicBottom',
    trend_following: 'trendFollowing',
    mean_reversion: 'meanReversion',
    volatility_contraction_breakout: 'volatilityContractionBreakout',
};

const strategyKeys = {
    ma_cross: 'strategyMaCross',
    rsi: 'strategyRsi',
};

const factorParamKeys = {
    period: 'period',
    short_period: 'shortPeriod',
    long_period: 'longPeriod',
};

const valueKeys = {
    'Extremely Low': 'extremelyLow',
    Low: 'lowStatus',
    Normal: 'normal',
    Elevated: 'elevated',
    High: 'highStatus',
    'Extreme Fear': 'extremeFear',
    Fear: 'fear',
    Neutral: 'neutral',
    Greed: 'greed',
    'Extreme Greed': 'extremeGreed',
    'served from local cache (no network)': 'localCache',
};

const LanguageContext = createContext(null);

function readInitialLanguage() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'zh' || stored === 'en' ? stored : 'zh';
}

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(readInitialLanguage);

    const setLanguage = nextLanguage => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    };

    const value = useMemo(() => {
        const dict = dictionaries[language];
        const t = key => dict[key] || dictionaries.en[key] || key;
        const translateValue = valueText => t(valueKeys[valueText] || valueText);
        const factorLabel = name => t(factorKeys[name] || name);
        const templateLabel = name => t(templateKeys[name] || name);
        const strategyLabel = name => t(strategyKeys[name] || name);
        const factorParamLabel = (factorName, paramKey, fallback) => {
            if (factorName === 'volume_ratio' && paramKey === 'period') return t('volumeMa');
            if (factorName === 'return_n' && paramKey === 'period') return t('lookback');
            return t(factorParamKeys[paramKey] || fallback || paramKey);
        };

        return {
            language,
            setLanguage,
            t,
            translateValue,
            factorLabel,
            templateLabel,
            strategyLabel,
            factorParamLabel,
        };
    }, [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
    return ctx;
}
