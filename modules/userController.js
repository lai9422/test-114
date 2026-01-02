import dynamicR from './dynamicResources.js';//動態資源模組
import { handleRegister } from './register.js';//註冊模組
import { handleLogin } from './loginLogic.js';//登入邏輯模組


// 1. 顯示登入頁 (GET)
export function showLogin(res) {
    dynamicR(res, 'login', { error: null });
}

// 2. 處理登入邏輯 (POST)
export { handleLogin };

// 3. 顯示儀表板 (GET)
export function showDashboard(res) {
    const mockEmployees = [
        { name: "王小明", position: "前端工程師", status: "Active" },
        { name: "李美華", position: "人資經理", status: "Active" },
        { name: "張志豪", position: "實習生", status: "Inactive" }
    ];
    dynamicR(res, 'dashboard', { adminName: "模組化管理員", employees: mockEmployees });
}

// 4. 處理 404
export function Error404(res) {
    // 如果有 error.ejs 就用 dynamicR，沒有就回傳文字
    dynamicR(res, 'error', { message: "找不到此頁面 (404)" });
}

// 5. 顯示註冊頁 (GET)
export function showRegister(res) {
    dynamicR(res, 'register', { error: null });
}

// 7. 處理新增員工邏輯 (POST)
export function addEmployee(req, res) {
    let body = '';

    // 1. 接收前端傳來的資料片段
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // 2. 資料接收完畢後執行
    req.on('end', () => {
        try {
            // 把 JSON 字串轉成物件
            const newEmployeeData = JSON.parse(body);

            // --- 這裡寫入資料庫邏輯 (例如 db.push 或 SQL INSERT) ---
            console.log('收到新員工資料:', newEmployeeData);
            // 假設這裡已經成功存入資料庫...
            // ----------------------------------------------------

            // 3. 回傳成功訊息給前端
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '新增成功' }));

        } catch (error) {
            // 錯誤處理
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '伺服器錯誤' }));
        }
    });
}

// 6. 處理註冊邏輯 (POST)
export { handleRegister };