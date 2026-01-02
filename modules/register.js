// 檔案：modules/register.js
import dynamicR from './dynamicResources.js'; 
import querystring from 'querystring';
import db from '../db.js'; // 引入模擬資料庫

export function handleRegister(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', function() {
        const formData = querystring.parse(body);
        const { email, password } = formData;

        // --- 修改部分開始 ---
        
        // 1. 檢查 Email 是否已存在
        const existingUser = db.users.find(u => u.email === email);

        if (existingUser) {
            return dynamicR(res, 'register', { error: "這個 Email 已經被註冊過了！" });
        }

        // 2. 新增資料 (模擬 Insert)
        const newId = db.users.length + 1; // 簡單產生一個 ID
        const newUser = { id: newId, email, password };
        
        db.users.push(newUser); // 將新使用者推入陣列

        console.log(`新用戶 ${email} 註冊成功，ID: ${newId} (模擬模式)`);
        console.log('目前所有使用者:', db.users); // 印出來讓你看一下目前的資料

        // 註冊成功後導向登入頁
        res.writeHead(302, { 'Location': '/login' });
        res.end();

        // --- 修改部分結束 ---
    });
}