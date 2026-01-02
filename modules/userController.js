import db from '../db.js'; // 引入資料庫連線
import dynamicR from './dynamicResources.js';
import { handleRegister } from './register.js';
import { handleLogin } from './loginLogic.js';

// ------------------------------------------------
// 1. 顯示儀表板 (READ: 從資料庫讀取所有員工)
// ------------------------------------------------
export function showDashboard(res) {
    const sql = 'SELECT * FROM employees ORDER BY id DESC'; // 依照 ID 倒序排列 (最新的在上面)

    db.query(sql, function(err, results) {
        if (err) {
            console.error('讀取員工列表失敗:', err);
            dynamicR(res, 'error', { message: "資料庫讀取錯誤" });
            return;
        }

        // results 就是從資料庫拿出來的陣列，直接傳給 EJS
        dynamicR(res, 'dashboard', { 
            adminName: "資料庫管理員", 
            employees: results 
        });
    });
}

// ------------------------------------------------
// 2. 新增員工 (CREATE: 插入資料到資料庫)
// ------------------------------------------------
export function addEmployee(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body); // 解析前端傳來的 JSON
            const sql = 'INSERT INTO employees (name, email, position, department, status) VALUES (?, ?, ?, ?, ?)';
            
            // 執行 SQL 插入
            db.query(sql, [data.name, data.email, data.position, data.department, data.status], (err, result) => {
                if (err) {
                    console.error('新增失敗:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
                    return;
                }

                console.log('新增員工成功, ID:', result.insertId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '新增成功' }));
            });

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '伺服器錯誤' }));
        }
    });
}

// ------------------------------------------------
// 3. 刪除員工 (DELETE: 從資料庫刪除)
// ------------------------------------------------
export function deleteEmployee(req, res, id) {
    const sql = 'DELETE FROM employees WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('刪除失敗:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
            return;
        }

        if (result.affectedRows > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '刪除成功' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '找不到該員工' }));
        }
    });
}

// ------------------------------------------------
// 4. 修改員工 (UPDATE: 更新資料庫內容)
// ------------------------------------------------
export function updateEmployee(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const sql = 'UPDATE employees SET name=?, email=?, position=?, department=?, status=? WHERE id=?';

            db.query(sql, [data.name, data.email, data.position, data.department, data.status, id], (err, result) => {
                if (err) {
                    console.error('更新失敗:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
                    return;
                }

                if (result.affectedRows > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: '更新成功' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: '找不到該員工' }));
                }
            });

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '伺服器錯誤' }));
        }
    });
}

// 其他原本的函式 (不需要動)
export function showLogin(res) {
    dynamicR(res, 'login', { error: null });
}

export function showRegister(res) {
    dynamicR(res, 'register', { error: null });
}

export function Error404(res) {
    dynamicR(res, 'error', { message: "找不到此頁面 (404)" });
}

export { handleLogin, handleRegister };