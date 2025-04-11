/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 20:18:45
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-11 22:24:12
 * @FilePath: \trading\src\api\symbols.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from './axiosInstance';

export const getSymbolList = async () => {
  const res = await axios.get('/symbols');
  return res.data;
};
