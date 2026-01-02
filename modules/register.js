import db from '../db.js';
import querystring from 'querystring';
import dynamicR from './dynamicResources.js';

/**
 * handleRegister
 * 處理使用者提交的登入表單 (POST 請求)。
 */
export function handleRegister(req, res) {
    
    // --- 階段 A: 接收數據流 (Data Streaming) ---
    // 在 Node.js 中，HTTP POST 的資料不是「瞬間」全部到達的，而是像水流一樣分批到達。
    // 所以我們需要一個水桶 (body 變數) 來接水。
    let body = '';

    // 監聽 'data' 事件：
    // 每當瀏覽器傳來一小塊資料 (chunk)，這個函式就會被觸發。
    // chunk 預設是 Buffer (二進位數據)，像是一堆 010101。
    // chunk.toString() 把這些二進位翻成文字，然後拼接到 body 裡。
    req.on('data', chunk => { 
        body += chunk.toString(); 
    });

    // 監聽 'end' 事件：
    // 當瀏覽器說「資料傳完了」，Node.js 就會觸發這個事件。
    // 這時候 body 已經收集了完整的字串，例如 "email=test@gmail.com&password=123"。
    req.on('end', function() {
        
        // --- 階段 B: 解析數據 ---
        // 使用 querystring.parse 把那串長長的字串變成好用的 JavaScript 物件。
        // 轉換前： "email=test@gmail.com&password=123"
        // 轉換後： { email: 'test@gmail.com', password: '123' }
        const formData = querystring.parse(body);
        
        // 使用「解構賦值」語法，一次把 email 和 password 從物件裡拿出來變數化。
        const { email, password } = formData; 

        // --- 階段 C: 準備 SQL 指令 ---
        // 重點注意：這裡使用了 ? 作為佔位符 (Placeholder)。
        // 這是為了防止 SQL Injection (資料隱碼攻擊)。
        // 如果我們直接用字串相加，駭客可以輸入特殊符號來騙過資料庫。
        // 用 ? 的話，mysql 套件會幫我們把輸入的內容當作「純文字」處理，絕對安全。
        const sqlInstruction = 'SELECT * FROM users WHERE email = ? AND password = ?';

        // --- 階段 D: 查詢資料庫 ---
        // db.query(SQL語法, [參數陣列], 回呼函式)
        db.query(sqlInstruction, [email, password], function(err, results) {
            
            // 情況 1: 資料庫系統錯誤
            // 這是指 SQL 語法寫錯、或是資料庫伺服器掛掉等嚴重錯誤。
            if (err) {
                console.error(err); // 印出來除錯
                // 使用我們剛剛寫好的 dynamicR 回傳登入頁面，並附帶錯誤訊息
                dynamicR(res, 'login', { error: "系統錯誤，請稍後再試" });
                return; // 停止執行
            }

            // --- 階段 E: 判斷查詢結果 ---
            // results 永遠是一個「陣列 (Array)」。
            // 就算只找到 1 個人，它也是 [ {id:1, email:...} ]。
            // 如果沒找到人，它就是空陣列 []。
            
            if (results.length > 0) {
                // 情況 2: 登入成功
                // results.length > 0 代表箱子裡有東西，表示帳號密碼匹配成功。
                
                console.log(`使用者 ${results[0].email} 登入成功`);
                
                // HTTP 302: 臨時重新導向 (Found / Redirect)。
                // Location: '/dashboard' 告訴瀏覽器：「請你立刻自動跳轉到儀表板頁面」。
                // 這裡不渲染 HTML，而是直接命令瀏覽器換頁。
                res.writeHead(302, { 'Location': '/dashboard' });
                res.end();
                
            } else {
                // 情況 3: 登入失敗
                // results.length 等於 0，代表資料庫翻遍了都找不到這組帳密。
                
                // 我們重新渲染登入頁面 ('login')，但在數據中多傳一個 error 欄位。
                // EJS 模板收到這個 error 後，就會在畫面上顯示紅色的警告字眼。
                dynamicR(res, 'login', { error: "帳號或密碼錯誤" });
            }
        });
    });
}