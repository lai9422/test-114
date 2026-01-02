// 檔案：router.js
import * as controller from './modules/userController.js';

function router(req, res) {
    const url = req.url;
    const method = req.method;

    // --- 處理動態路由 (API) ---
    
    // 1. 處理刪除 (DELETE /api/employees/{id})
    // 使用 Regex 檢查網址是否符合 /api/employees/數字
    if (url.match(/\/api\/employees\/\d+/) && method === 'DELETE') {
        const id = url.split('/').pop(); // 取得網址最後面的 ID
        controller.deleteEmployee(req, res, id);
        return; // 處理完直接結束，不進入下方的 switch
    }

    // 2. 處理修改 (PUT /api/employees/{id})
    if (url.match(/\/api\/employees\/\d+/) && method === 'PUT') {
        const id = url.split('/').pop();
        controller.updateEmployee(req, res, id);
        return;
    }

    // --- 處理靜態路由 ---
    switch (url) {
        case '/':
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            break;

        case '/login':
            if (method === 'GET') controller.showLogin(res);
            else if (method === 'POST') controller.handleLogin(req, res);
            break;
        
        case '/register':
            if (method === 'GET') controller.showRegister(res);
            else if (method === 'POST') controller.handleRegister(req, res);
            break;

        case '/api/employees':
            if (method === 'POST') controller.addEmployee(req, res);
            break;

        case '/dashboard':
            if (method === 'GET') controller.showDashboard(res);
            break;
        
        default:
            controller.Error404(res);
            break;
    }
}

export default router;