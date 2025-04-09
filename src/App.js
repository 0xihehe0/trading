/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2025-04-07 22:08:24
 * @LastEditors: yaojinxi 864554492@qq.com
 * @LastEditTime: 2025-04-07 22:11:52
 * @FilePath: \trading\src\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import StockChart from './StockChart.jsx';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📈 股票价格可视化</h2>
      <StockChart />
    </div>
  );
}

export default App;
