/*
 * @Author: Clloz
 * @Date: 2020-08-09 11:40:29
 * @LastEditTime: 2020-08-09 13:09:22
 * @LastEditors: Clloz
 * @Description:entry
 * @FilePath: /W3C_crawler/index.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸，学不可以已。
 */
const express = require('express');
const app = express();
const superagent = require('superagent');
const cheerio = require('cheerio');
const open = require('open');

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your App is running at http://%s:%s', host, port);
});

let CSS_std = [];

superagent.get('https://www.w3.org/TR/').end((err, res) => {
    if (err) {
        console.log(`抓取失败：${err}`);
    } else {
        CSS_std = getCSSStd(res);
        console.log('complete!');
        open('http://localhost:3000/');
    }
});

function getCSSStd(res) {
    let stdArr = [];
    let $ = cheerio.load(res.text);

    $('#container [data-tag="css"]').each((idx, el) => {
        let std = {
            name: $(el).children('h2').children('a').attr('title'),
            url: $(el).children('h2').children('a').attr('href'),
        };
        stdArr.push(std);
    });
    return stdArr;
}

function buildTemplate(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += `<li><a href="${arr[i].url}" target="_blank">${arr[i].name}</a></li>`;
    }
    return `<html name=clloz>
    <head>
    </head>
    <body>
        <ul>
           ${str}
        </ul>
    </body>
    </html>`;
}

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(buildTemplate(CSS_std));
});
