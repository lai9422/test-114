  const contentTypes = {
  '.html': 'text/html; charset=utf-8',        // HTML 網頁文件
  '.ejs': 'text/html; charset=utf-8',         // EJS 模板（渲染後輸出為 HTML）
  '.js': 'text/javascript; charset=utf-8',    // JavaScript 腳本文件
  '.css': 'text/css; charset=utf-8',          // CSS 樣式表文件
  '.json': 'application/json',                // JSON 資料格式
  '.png': 'image/png',                        // PNG 圖片格式
  '.jpg': 'image/jpg',                        // JPG/JPEG 圖片格式
  '.gif': 'image/gif',                        // GIF 動畫圖片
  '.svg': 'image/svg+xml',                    // SVG 向量圖形
  '.ico': 'image/x-icon'                      // 網站 favicon 圖示
};

function getContentType(extname) {
    const contentType = contentTypes[extname] || 'text/plain';// 這個||「如果左邊沒東西，就用右邊的」 
    return contentType;
}


export default getContentType;