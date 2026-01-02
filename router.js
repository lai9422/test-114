// 檔案：router.js
import * as controller from './modules/userController.js'; // 把所有功能引入並取名為 controller

function router(req, res) {




    switch (req.url) {
        case '/':
            // 首頁直接導向登入
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            break;

        case '/login'://登入頁
            if (req.method === 'GET') {//顯示登入頁
                controller.showLogin(res);
            } else if (req.method === 'POST') {//處理登入邏輯
                controller.handleLogin(req, res);
            }
            break;
        
        case '/register':
            if (req.method === 'GET') {
                // 如果是用戶想看註冊表單
                controller.showRegister(res);
            } else if (req.method === 'POST') {
                // 如果是用戶送出註冊資料
                controller.handleRegister(req, res);
            }
            break;


        case '/api/employees': // 對應前端 fetch 的路徑
            if (req.method === 'POST') {
                // 呼叫 controller 裡面的函式來處理新增邏輯
                controller.addEmployee(req, res);
            }
            break;

        // ...

        case '/dashboard'://人員管理系統
            if (req.method === 'GET') {
                controller.showDashboard(res);
            }
            break;
        

        default://傳出錯誤頁面
            controller.Error404(res);
            break;
    }
}

export default router;