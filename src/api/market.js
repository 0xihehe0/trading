/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2026-05-04 13:56:22
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-04 14:02:25
 * @FilePath: \trading\src\api\market.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/api/market.js
import axios from './axiosInstance';

export const getMarketOverview = async range => {
    const res = await axios.get('/market_overview', {
        params: { range }
    });
    return res.data;
};
