import fs from 'fs';
import ejs from 'ejs';

/**
 * dynamicR (Dynamic Response)
 * 這是我們自定義的通用函式，用來處理所有需要 "EJS 渲染" 的回應。
 * res - HTTP 回應物件 (Response)，讓我們可以把結果傳回給瀏覽器。
 * filename - 模板的檔案名稱 (例如 'login' 或 'dashboard')。
 * data - 要填入模板的數據。
 * 寫法 data = {} 是 ES6 的「預設參數」。
 * 如果呼叫時沒傳數據 (例如只傳了 res 和 filename)，data 就會自動變成空物件 {}。
 * 這樣是為了防止 EJS 渲染時因為 data 是 undefined 而報錯。
 */
function dynamicR(res, filename, data = {}) {

    // --- 步驟 1: 拼湊檔案路徑 ---
    // 我們告訴電腦模板放在哪裡。這裡假設所有模板都在專案根目錄的 'views' 資料夾內。
    // 如果 filename 是 'index'，這裡就會變成 './views/index.ejs'。
    const filePath = './views/' + filename + '.ejs'; 

    // --- 步驟 2: 讀取檔案 (非同步) ---
    // 使用 fs.readFile 去硬碟撈檔案。
    // 'utf8'：這是編碼格式，確保讀出來的是我們看得懂的文字，而不是電腦的二進位亂碼。
    // callback function：因為讀硬碟很慢，Node.js 不會乾等，而是承諾「讀完後我會執行這個函式」。
    fs.readFile(filePath, 'utf8', function(err, template) {
        
        // --- 步驟 3: 錯誤檢查 ---
        // 凡事都要先做最壞的打算。如果 err 有值，代表檔案讀取失敗 (例如檔名打錯、檔案遺失)。
        if (err) {
            console.error(err); // 在後台印出錯誤，給工程師看
            
            // 回傳 404 Not Found 狀態碼
            // Content-Type 設為 text/plain (純文字)，因為我們只打算回傳一句簡單的錯誤訊息。
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('找不到頁面或模板錯誤');
            
            // 記得 return！這很重要，不然程式會繼續往下跑去執行 render，導致錯誤。
            return;
        }

        // --- 步驟 4: 渲染 HTML (把資料填進去) ---
        // 程式跑到這代表檔案讀到了。
        // ejs.render 是 EJS 的核心魔法：
        // 它會把 template (挖好洞的 HTML) 和 data (要填入的內容) 混合在一起。
        // 產出的 html 變數就是一個完整的、沒有挖空的標準 HTML 字串。
        const html = ejs.render(template, data);

        // --- 步驟 5: 發送回應 ---
        // 設定 HTTP 標頭 (Header)：
        // 狀態碼 200：代表一切順利 (OK)。
        // Content-Type: 'text/html'：
        //      這裡直接寫死是完全合理的！因為無論你的 EJS 檔名是什麼，
        //      經過 render 之後，它的本質就是 HTML。瀏覽器需要知道它是 HTML 才會把它畫出來。
        // charset=utf-8：確保中文不會變亂碼。
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        
        // 將最終的 HTML 送出，並結束這次請求。
        res.end(html);
    });
}

export default dynamicR;