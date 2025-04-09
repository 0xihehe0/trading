/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-09 21:04:57
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-09 21:05:03
 * @FilePath: \trading\src\config\constants.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const ranges = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
    { label: '2Y', value: '2y' }
  ];
  
  export const maRecommendations = {
    "1d": [5],
    "5d": [5, 10],
    "1mo": [5, 10, 20],
    "6mo": [20, 50],
    "1y": [50, 100],
    "2y": [50, 100, 200]
  };
  
  export const allMAOptions = [
    { label: 'MA5', value: 5 },
    { label: 'MA10', value: 10 },
    { label: 'MA20', value: 20 },
    { label: 'MA50', value: 50 },
    { label: 'MA100', value: 100 },
    { label: 'MA200', value: 200 }
  ];
  
  export const strategies = [
    { label: '均线交叉策略（MA Cross）', value: 'ma_cross' }
  ];
  