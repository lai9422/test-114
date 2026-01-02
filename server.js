import http from 'http';
import router from './router.js';

const PORT = 3000;
const server = http.createServer(router);

server.listen(PORT, function() {
  console.log('伺服器已啟動！請訪問 http://localhost:3000');
  console.log('可用路由：');
  console.log('  - http://localhost:3000');
  console.log('  - http://localhost:3000/dashboard');
  console.log('  - 其他路徑將顯示 404 錯誤頁面');
});
