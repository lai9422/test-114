// 檔案：db.js
// --- 模擬資料庫 (暫存在記憶體中) ---

// 定義一個陣列來存放使用者資料
// 預設先建立一組測試帳號
const users = [
    { 
        id: 1, 
        email: 'test@gmail.com', 
        password: '123' 
    }
];

// 匯出這個物件，讓其他檔案可以讀取或修改
export default { users };