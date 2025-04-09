/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 21:21:13
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 21:21:20
 * @FilePath: \trading\src\api\axiosInstance.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

// 可选：统一处理错误提示
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    console.error('请求出错:', err.response || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
