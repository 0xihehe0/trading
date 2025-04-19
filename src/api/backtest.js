/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-19 20:49:58
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-19 21:15:27
 * @FilePath: \trading\src\api\backtest.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from './axiosInstance';

export const getBackTest = async (ticker, range, strategy, params = {},initial_capital,commission) => {
  const res = await axios.post('/strategy_backtest_combined', {
    ticker,
    range,
    strategy,
    params,
    initial_capital,
    commission
  });
  return res.data;
};
