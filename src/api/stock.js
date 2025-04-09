/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:18:26
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 21:24:17
 * @FilePath: \trading\src\api\stock.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// api/stock.js
import axios from '../utils/axiosInstance';

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
