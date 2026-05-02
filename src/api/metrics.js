/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2026-05-01 21:58:43
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2026-05-01 22:25:20
 * @FilePath: \trading\src\api\metrics.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/api/metrics.js
import axios from './axiosInstance';
 
/**
 * 获取个股风险收益指标
 * @param {string} ticker - 股票代码
 * @param {string} range - 时间范围
 * @returns {object} { ticker, range, metrics: {...} }
 */
export const getStockMetrics = async (ticker, range) => {
    const res = await axios.get('/stock_metrics', {
        params: { ticker, range }
    });
    return res.data;
};