// src/App.jsx
import React, { useState } from 'react';
import MarketOverview from './components/market/MarketOverview';
import StockAnalysis from './components/stock/StockAnalysis';
import FactorLab from './components/factor/FactorLab';
import s from './App.module.css';
import SectionHeader from './components/common/SectionHeader';
import { useI18n } from './config/i18n';

function App() {
    const [marketCollapsed, setMarketCollapsed] = useState(false);
    const { language, setLanguage, t } = useI18n();

    return (
        <div className={s.app}>
            <div className={s.header}>
                <h1 className={s.headerTitle}>TERMINAL</h1>
                <div className={s.headerRight}>
                    <div className={s.languageToggle}>
                        <button
                            className={`${s.languageBtn} ${language === 'zh' ? s.languageBtnActive : ''}`}
                            onClick={() => setLanguage('zh')}
                        >
                            {t('langZh')}
                        </button>
                        <button
                            className={`${s.languageBtn} ${language === 'en' ? s.languageBtnActive : ''}`}
                            onClick={() => setLanguage('en')}
                        >
                            {t('langEn')}
                        </button>
                    </div>
                    <span className={s.headerSub}>{t('appSubtitle')}</span>
                </div>
            </div>

            <div className={s.body}>
                <SectionHeader
                    title={t('marketOverview')}
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

                <SectionHeader title={t('stockAnalysis')} color="purple" />
                <StockAnalysis />

                <hr className={s.divider} />

                <SectionHeader title={t('factorLab')} color="green" />
                <FactorLab />
            </div>
        </div>
    );
}

export default App;
