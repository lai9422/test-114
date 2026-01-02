// 檔案：modules/loginLogic.js
import db from '../db.js'; // 引入剛剛改好的模擬資料庫
import querystring from 'querystring';
import dynamicR from './dynamicResources.js';

export function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', function() {
        const formData = querystring.parse(body);
        const { email, password } = formData;

        // --- 修改部分開始 ---
        // 原本是用 db.query(SQL...)，現在改成直接在陣列中尋找
        // 邏輯：在 db.users 裡面找一個 user，他的 email 和 password 都符合輸入的值
        const user = db.users.find(u => u.email === email && u.password === password);

        if (user) {
            // 有找到 user (user 變數不是 undefined)，代表登入成功
            console.log(`使用者 ${user.email} 登入成功 (模擬模式)`);
            res.writeHead(302, { 'Location': '/dashboard' });
            res.end();
        } else {
            // 沒找到，代表失敗
            console.log(`登入失敗：${email}`);
            dynamicR(res, 'login', { error: "帳號或密碼錯誤" });
        }
        // --- 修改部分結束 ---
    });
}