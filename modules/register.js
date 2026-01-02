// ==========================================
// 1. 模組引入區
// ==========================================

// 引入自定義的模組 dynamicR。
// 通常這是用來處理「動態回應」的工具，例如：渲染 HTML 模板並把資料填進去後回傳給瀏覽器。
import dynamicR from './dynamicResources.js'; 

// 引入 Node.js 內建的 querystring 模組。
// 它的作用是解析 URL 編碼的字串。
// 例如將 "email=test@gmail.com&password=123" 轉換成物件 { email: 'test@gmail.com', password: '123' }
import querystring from 'querystring';

// 引入資料庫連線物件。
// 這個 db 變數通常是 mysql 或 mysql2 套件建立的連線池 (Connection Pool)。
import db from '../db.js';


// ==========================================
// 2. 主函式定義區：處理註冊請求 (handleRegister)
// ==========================================

/**
 * handleRegister 函式
 * @param {object} req - HTTP 請求物件 (Request)，包含瀏覽器傳來的所有資訊 (Header, Body 等)。
 * @param {object} res - HTTP 回應物件 (Response)，用來發送資料回瀏覽器。
 */
export function handleRegister(req, res) {
    
    // --- 階段 A: 接收資料流 (Data Streaming) ---
    
    // 初始化一個空字串 body，用來暫存從瀏覽器傳過來的原始資料。
    let body = '';
    
    // 監聽 'data' 事件：
    // 在 Node.js 原生伺服器中，POST 請求的資料量可能很大，不會一次全部到達。
    // 資料會像水流一樣分成很多小塊 (chunk) 陸續傳送。
    // 每當收到一個 chunk (資料塊)，這個函式就會執行一次，我們將它轉成字串並拼接到 body 變數中。
    req.on('data', chunk => { 
        body += chunk.toString(); 
    });
    
    // 監聽 'end' 事件：
    // 當所有的資料塊都傳送完畢時，Node.js 會觸發 'end' 事件。
    // 這代表 body 變數已經收集了完整的請求內容，我們可以開始處理業務邏輯了。
    req.on('end', function() {
        
        // --- 階段 B: 解析資料 (Parsing) ---

        // 使用 querystring 將原始字串解析成 JavaScript 物件。
        // 假設 body 是 "email=user@example.com&password=123456"
        // formData 就會變成 { email: 'user@example.com', password: '123456' }
        const formData = querystring.parse(body);
        
        // 使用「物件解構賦值 (Destructuring)」語法。
        // 直接從 formData 中取出 email 和 password 這兩個屬性，存成同名的變數。
        // 這行等同於：
        // const email = formData.email;
        // const password = formData.password;
        const { email, password } = formData; 

        
        // --- 階段 C: 資料庫邏輯 - 檢查 Email 是否存在 ---

        // 定義 SQL 查詢語句。
        // 注意：這裡使用 `?` 作為佔位符 (Placeholder)，這是為了防止 SQL Injection (SQL 資料隱碼攻擊)。
        // 絕對不要直接用字串相加的方式把 email 拼進 SQL 裡。
        const checkSql = 'SELECT * FROM users WHERE email = ?';
        
        // 執行資料庫查詢。
        // 參數說明：
        // 1. checkSql: SQL 語句
        // 2. [email]: 要填入 `?` 的實際數值陣列
        // 3. Callback function: 當資料庫查詢結束後，會回頭執行這個函式
        db.query(checkSql, [email], (err, results) => {
            
            // 情況 1: 資料庫發生系統錯誤 (例如連線斷掉、SQL 語法錯誤)
            if (err) {
                // 在伺服器後台印出錯誤細節，方便工程師除錯
                console.error(err);
                
                // 呼叫 dynamicR 函式回傳錯誤頁面給使用者
                // 這裡假設 'register' 是模板名稱，後面物件是傳給模板的變數
                // `return` 關鍵字很重要，它確保程式執行到這裡就停止，不會繼續往下跑
                return dynamicR(res, 'register', { error: "資料庫錯誤" });
            }

            // 情況 2: 查詢成功，但在資料庫中找到了相符的資料
            // results 是一個陣列，若 length > 0 代表這個 email 已經存在於 users 資料表中
            if (results.length > 0) {
                // 回傳錯誤訊息告知使用者，並停止後續動作
                return dynamicR(res, 'register', { error: "這個 Email 已經被註冊過了！" });
            }

            // --- 階段 D: 資料庫邏輯 - 新增使用者 (Insert) ---
            
            // 如果程式跑到這裡，代表上面兩個 return 都沒執行，也就是沒有錯誤且 Email 沒被註冊過。
            
            // 定義插入資料的 SQL。同樣使用 `?` 來保護資料庫安全。
            const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            
            // 執行插入動作
            // 注意：這裡發生了 callback hell (回呼地獄) 的前兆，也就是 query 裡面又包了一層 query。
            // 這是為了確保「先檢查完」才能「執行新增」。
            db.query(insertSql, [email, password], (err2, results2) => {
                
                // 情況 1: 新增時發生錯誤
                if (err2) {
                    console.error(err2);
                    return dynamicR(res, 'register', { error: "註冊失敗，請稍後再試" });
                }

                // 情況 2: 新增成功
                // results2.insertId 通常包含新的一筆資料的主鍵 ID (Primary Key)
                console.log(`新用戶 ${email} 註冊成功，ID: ${results2.insertId}`);
                
                // --- 階段 E: 回應與轉導 (Redirect) ---
                
                // 設定 HTTP 狀態碼為 302 (Found / Temporary Redirect)。
                // 設定 Response Header 的 'Location' 屬性為 '/login'。
                // 這會告訴瀏覽器：「註冊好了，請你現在自動跳轉到登入頁面」。
                res.writeHead(302, { 'Location': '/login' });
                
                // 結束這個 HTTP 回應。
                // 如果沒有呼叫 res.end()，瀏覽器會一直轉圈圈等待回應。
                res.end();
            });
        });
    });
}