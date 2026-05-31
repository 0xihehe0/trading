import axios from './axiosInstance';

export const getFactors = async () => {
  const res = await axios.get('/factors');
  return res.data;
};

export const runFactorBacktest = async ({
  ticker,
  range,
  conditions,
  entry_conditions,
  exit_conditions,
  template,
  initial_capital = 10000,
  commission = 0.001,
  min_duration = 1
}) => {
  const res = await axios.post('/factor_backtest', {
    ticker,
    range,
    conditions,
    entry_conditions,
    exit_conditions,
    template,
    initial_capital,
    commission,
    min_duration
  });
  return res.data;
};
