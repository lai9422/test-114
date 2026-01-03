import mysql from 'mysql2';

// 配置連線資訊
const config = {
    host: 'localhost',          // [修改] 將 IP 改為 'localhost' 或 '127.0.0.1'
    user: 'root',               // [修改] 改為您本地資料庫的使用者名稱 (通常是 'root')
    password: 'aeust',     // [修改] 改為您本地資料庫的密碼
    database: 'aeust'           // [保留/修改] 確保您本地也有一個名為 'aeust' 的資料庫
}

// 建立連線
const connection = mysql.createConnection(config);

// 執行連線
connection.connect(function(err) {
    if (err) {
        console.error('資料庫連線失敗：', err);
    } else {
        console.log('成功連線到本地 MySQL 資料庫'); // [可選] 修改 log 訊息以便辨識
    }
});

export default connection;