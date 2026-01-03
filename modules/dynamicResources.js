import fs from 'fs';
import ejs from 'ejs';

function dynamicR(res, filename, data = {}) {//template 沒傳數據，所以是靜態渲染；{data: 'value'}是有數據時的動態渲染
    const filePath = './views/' + filename + '.ejs'; // 模板在views目錄
    fs.readFile(filePath, 'utf8', function(err, template) {
        if (err) {
            console.error(err);
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('找不到頁面或模板錯誤');
            return;
        }
        const html = ejs.render(template, data);//這裡用了EJS的render方法來渲染模板，並傳入資料
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });//這串文字叫做 HTTP Header (回應標頭)，它是瀏覽器的「使用說明書」。
        //直接寫死 'text/html; charset=utf-8' 反而更合理，因為 EJS 模板渲染後的內容本質上是 HTML，所以不需要受到 mimeTypes.js 的影響。
        res.end(html);
    });
}

export default dynamicR;