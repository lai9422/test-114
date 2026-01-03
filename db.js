import mysql from 'mysql2';


// 配置連線資訊
const config = {
    host: '34.81.11.12',
    user: 'AEUST_student',
    password: '112111122',
    database: 'aeust'
}
// 建立連線
const connection = mysql.createConnection(config);


// 執行連線
connection.connect(function(err) {
    if (err) {
        console.error('資料庫連線失敗：', err);
    } else {
        console.log('成功連線到MySQL資料庫');
    }
});

export default connection;