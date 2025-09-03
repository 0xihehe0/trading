/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:18:26
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-09-03 22:56:28
 * @FilePath: \trading\src\api\stock.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// api/stock.js
import axios from './axiosInstance';

export const getStockData = async (ticker, range, maArray = []) => {
  const maParam = maArray.join(',');
  const res = await axios.get('/stock', {
    params: {
      ticker,
      range,
      ma: maParam
    }
  });
  return res.data;
};

export const postNewdata = async (ticker,lastDay) => {
  // 建议把前端上下文也传给后端，后端可直接返回同结构数据以便立即刷新图表
  const payload = {
    ticker,
    lastDay
  };
  const res = await axios.post('/newstock', payload); // 对应后端 /api/newstock
  return res.data; // 期望后端也返回 { data, meta }；若只回 meta，App 里有兜底
};
