// ==========================================
// 1. 模組引入區
// ==========================================

// 引入 Node.js 內建的 'fs' (File System) 模組。
// 它的作用是讓我們可以讀取、寫入或操作伺服器硬碟上的檔案。
// 在這裡，我們需要用它來讀取 .ejs 模板檔案的內容。
import fs from 'fs'; 

// 引入第三方套件 'ejs' (Embedded JavaScript templates)。
// 這是一個模板引擎，它的功能就像是一個「填空機」。
// 它允許我們在 HTML 裡面挖洞 (例如 <%= name %>)，然後用程式把變數填進去。
import ejs from 'ejs';


// ==========================================
// 2. 核心函式定義：dynamicR (動態資源回應)
// ==========================================

/**
 * dynamicR 函式
 * 用途：讀取指定的 EJS 模板，將資料渲染成 HTML 後回應給瀏覽器。
 * * @param {object} res - HTTP 回應物件 (Response)，用來發送資料回瀏覽器。
 * @param {string} filename - 模板的檔案名稱 (不包含路徑與副檔名，例如傳入 'index')。
 * @param {object} data - (選填) 要傳給模板的資料物件。
 * 這裡使用了 ES6 的「預設參數 (Default Parameter)」語法：
 * 如果呼叫函式時沒有傳入第三個參數，data 就會自動預設為空物件 {}，
 * 這樣可以防止後面程式碼報錯 (undefined error)。
 */
function dynamicR(res, filename, data = {}) {

    // --- 步驟 A: 建構檔案路徑 ---
    
    // 組合出完整的檔案路徑。
    // 假設 filename 是 'login'，結果就會是 './views/login.ejs'。
    // './views/' 代表程式會去專案根目錄下的 views 資料夾尋找檔案。
    const filePath = './views/' + filename + '.ejs'; 

    // --- 步驟 B: 讀取檔案 (非同步) ---
    
    // 使用 fs.readFile 讀取檔案內容。
    // 參數 1: filePath (檔案在哪裡)
    // 參數 2: 'utf8' (編碼格式，確保讀出來是文字字串而不是二進位 Buffer)
    // 參數 3: Callback function (當讀取完成後，Node.js 會回頭執行這個函式)
    //         這個 Callback 接收兩個參數：err (錯誤訊息) 和 template (檔案內容)
    fs.readFile(filePath, 'utf8', function(err, template) {
        
        // --- 步驟 C: 錯誤處理 (Error Handling) ---
        
        // 如果 err 有值，代表讀取失敗 (例如檔案不存在、權限不足等)
        if (err) {
            // 在伺服器後台印出詳細錯誤，方便開發者除錯
            console.error(err);
            
            // 設定 HTTP 狀態碼為 404 (Not Found)。
            // Content-Type 設為純文字 (text/plain)，並指定 utf-8 以防亂碼。
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            
            // 回傳簡單的錯誤訊息給瀏覽器
            res.end('找不到頁面或模板錯誤');
            
            // 重要！使用 return 結束函式執行。
            // 如果沒有這個 return，程式會繼續往下跑去執行 render，導致重複回應 (Double Response) 的錯誤。
            return;
        }

        // --- 步驟 D: 模板渲染 (Rendering) ---
        
        // 程式執行到這裡，代表檔案讀取成功，template 變數裡裝著 .ejs 檔案的原始碼。
        
        // 使用 ejs.render 方法進行「混合」。
        // template: 帶有挖空的 HTML 字串 (例如 <h1>Hello <%= user %></h1>)
        // data: 要填入的資料 (例如 { user: 'Gemini' })
        // html: 渲染後的完整 HTML 字串 (例如 <h1>Hello Gemini</h1>)
        // 注意：如果 data 是空物件 {}，那模板裡面的變數必須要有預設處理，否則 EJS 會報錯。
        const html = ejs.render(template, data);

        // --- 步驟 E: 回應給瀏覽器 (Response) ---
        
        // 設定 HTTP 狀態碼為 200 (OK，請求成功)。
        // Content-Type 寫死為 'text/html' 是完全正確的邏輯。
        // 因為無論你的 EJS 檔名是什麼，經過 ejs.render() 處理後，產出的結果本質上就是 HTML 程式碼。
        // 指定 charset=utf-8 非常重要，否則中文內容在瀏覽器上會變成亂碼。
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        
        // 將最終生成的 HTML 字串發送給瀏覽器，並結束這次的請求-回應循環 (Request-Response Cycle)。
        // 這時候，使用者的瀏覽器就會開始解析 HTML 並畫出畫面。
        res.end(html);
    });
}

// ==========================================
// 3. 模組導出區
// ==========================================

// 使用 ES6 的 export default 語法導出這個函式。
// 這樣其他檔案 (例如 index.js 或 server.js) 就可以用 import dynamicR from '...' 來使用它。
export default dynamicR;