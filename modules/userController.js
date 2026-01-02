// 檔案：modules/userController.js
import dynamicR from './dynamicResources.js';
import { handleRegister } from './register.js';
import { handleLogin } from './loginLogic.js';

// --- 模擬資料庫 (暫存在記憶體中) ---
// 給每個員工一個唯一的 id，方便修改和刪除
let employees = [
    { id: 1, name: "王小明", email: "ming@example.com", position: "前端工程師", department: "工程部", status: "Active" },
    { id: 2, name: "李美華", email: "mei@example.com", position: "人資經理", department: "人資部", status: "Active" },
    { id: 3, name: "張志豪", email: "hao@example.com", position: "實習生", department: "工程部", status: "Inactive" }
];
// 用來產生下一個 ID
let nextId = 4;

// 1. 顯示登入頁
export function showLogin(res) {
    dynamicR(res, 'login', { error: null });
}

// 2. 匯出登入邏輯
export { handleLogin };

// 3. 顯示儀表板
export function showDashboard(res) {
    // 這裡直接使用上面的全域變數 employees
    dynamicR(res, 'dashboard', { adminName: "模組化管理員", employees: employees });
}

// 4. 處理 404
export function Error404(res) {
    dynamicR(res, 'error', { message: "找不到此頁面 (404)" });
}

// 5. 顯示註冊頁
export function showRegister(res) {
    dynamicR(res, 'register', { error: null });
}

// 6. 匯出註冊邏輯
export { handleRegister };

// 7. 新增員工 (POST)
export function addEmployee(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const newEmp = JSON.parse(body);
            // 賦予新 ID 並加入陣列
            newEmp.id = nextId++;
            employees.unshift(newEmp); // 加到最前面

            console.log('新增員工:', newEmp);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '新增成功', id: newEmp.id }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '伺服器錯誤' }));
        }
    });
}

// 8. 刪除員工 (DELETE)
export function deleteEmployee(req, res, id) {
    // 過濾掉該 ID 的員工
    const originalLength = employees.length;
    employees = employees.filter(emp => emp.id !== parseInt(id));

    if (employees.length < originalLength) {
        console.log(`員工 ID ${id} 已刪除`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: '刪除成功' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: '找不到該員工' }));
    }
}

// 9. 修改員工 (PUT)
export function updateEmployee(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const updateData = JSON.parse(body);
            const index = employees.findIndex(emp => emp.id === parseInt(id));

            if (index !== -1) {
                // 更新資料 (保留原本 ID)
                employees[index] = { ...employees[index], ...updateData };
                console.log(`員工 ID ${id} 已更新`, employees[index]);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '更新成功' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: '找不到該員工' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '更新失敗' }));
        }
    });
}