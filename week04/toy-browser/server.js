/*
 * @Author: Clloz
 * @Date: 2020-07-25 12:36:08
 * @LastEditTime: 2020-07-26 19:17:24
 * @LastEditors: Clloz
 * @Description: toy-browser server
 * @FilePath: /toy-browser/server.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸，学不可以已。
 */

const http = require('http');

const server = http.createServer((req, res) => {
    /**
     * @description: receive request from client, response a mock html.
     * @param {type}
     * @return:
     */
    console.log('request received');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Name', 'Clloz');
    res.writeHead('200', { 'Content-Type': 'text/plain' });
    res.end(
        `<html name=clloz>
<head>
    <style>
        body div #myid {
            width: 100px;
            background-color: #ff5000;
        }
        body div img {
            width: 30px;
            background-color: #ff1111;
        }
    </style>
</head>
<body>
    <div>
        <img id="myid" />
        <img />
    </div>
</body>
</html>`
    );
});

server.listen(8088);

console.log('Server started');
