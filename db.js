import mysql from 'mysql2';

// 配置連線資訊
const config = {
    host: 'localhost',       // 1. 改成 'localhost' 代表本機
    user: 'root',            // 2. 本機測試通常預設帳號是 'root' (除非你另外建了使用者)
    password: 'aeust',            // 3. 這裡要填你本機 MySQL 的密碼 
    //    (XAMPP 預設通常是空字串，MAMP 預設通常是 'root')
    database: 'aeust',       // 4. 對應你 SQL 指令中的 `use aeust;`
    port: 3306               // 5. 預設是 3306，如果有改過 port 要加上這行
}

// 建立連線
const connection = mysql.createConnection(config);

// 執行連線
connection.connect(function(err) {
    if (err) {
        console.error('資料庫連線失敗：', err);
    } else {
        console.log('成功連線到本機 MySQL 資料庫');
    }
});

export default connection;