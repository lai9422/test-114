import dynamicR from './dynamicResources.js'; 
import querystring from 'querystring';
import db from '../db.js';

// 2. 定義函式
export function handleRegister(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', function() {
        const formData = querystring.parse(body);
        const { email, password } = formData; // 這裡我們只拿 email, password (如您的需求)

        // 【邏輯一】檢查 Email
        const checkSql = 'SELECT * FROM users WHERE email = ?';
        
        db.query(checkSql, [email], (err, results) => {
            if (err) {
                console.error(err);
                return dynamicR(res, 'register', { error: "資料庫錯誤" });
            }

            if (results.length > 0) {
                return dynamicR(res, 'register', { error: "這個 Email 已經被註冊過了！" });
            }

            // 【邏輯二】新增資料
            const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            
            db.query(insertSql, [email, password], (err2, results2) => {
                if (err2) {
                    console.error(err2);
                    return dynamicR(res, 'register', { error: "註冊失敗，請稍後再試" });
                }

                console.log(`新用戶 ${email} 註冊成功，ID: ${results2.insertId}`);
                
                res.writeHead(302, { 'Location': '/login' });
                res.end();
            });
        });
    });
}