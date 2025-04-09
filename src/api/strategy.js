/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:18:38
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 21:35:39
 * @FilePath: \trading\src\api\strategy.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// api/strategy.js
import axios from './axiosInstance';

export const getStrategySignals = async (ticker, range, strategy, params = {}) => {
  const res = await axios.post('/strategy', {
    ticker,
    range,
    strategy,
    params
  });
  return res.data;
};
