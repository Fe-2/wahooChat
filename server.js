/*
websocket支持两种类型的数据传输：text类型和binary类型，其中二进制数据是通过流的模式发送和读取的
https://api.starter-us-west-2.openshift.com/oapi/v1/namespaces/wahoo/buildconfigs/wahoo/webhooks/eec91e5acc6172b6/github
*/
const ws = require('nodejs-websocket');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mime = require('./mine').types;
let app = http.createServer((request, response) => {
    var pathName = url.parse(request.url).pathname;
    var realPath = request.url.substring(1);
    var extName = realPath;
    var indexOfQuestionMark = extName.indexOf('?');
    if (indexOfQuestionMark >= 0) {
        extName = extName.substring(0, indexOfQuestionMark);
        realPath = realPath.substring(0, indexOfQuestionMark);
    }
    extName = path.extname(extName);
    extName = extName ? extName.slice(1) : 'unknown';
    console.log(pathName + '\n');
    if (!fs.existsSync(realPath)) {
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.write('The request URL:' + realPath + ' could not be found.');
        response.end();
        return;
    }
    fs.readFile(realPath, 'utf8', function(err, file) {
        if (err) {
            response.writeHead(500, { 'content-type': 'text/plain' });
            response.end(err);
            return;
        }
        var contentType = mime[extName] || 'text/plain';
        response.writeHead(200, { 'content-type': contentType });
        response.write(file, 'utf8');
        response.end();
    });
});
app.listen(8888);
//以上步骤成功在8888端口渲染出相应的html界面
//conn是对应的connection的实例
const userList = [];
var server = ws.createServer(function(conn) {
    console.log('new conneciton');
    //监听text事件，每当收到文本时触发
    conn.on("text", function(str) {
        broadcast(server, str);
        console.log(str);
    });
    //当任何一端关闭连接时触发，这里就是在控制台输出connection closed
    conn.on("close", function(code, reason) {
        console.log('connection closed');
    })
    conn.on('error', function(error) {
        console.log('error');
    })
});
server.listen(8080);
//注意这里的listen监听是刚才开通的那个服务器的端口，客户端将消息发送到这里处理
var cmd = {
        login: 600,
        send_msg: 601,
    },
    event = {
        login: 800,
        send_msg: 801,
    };

function broadcast(server, msg) {
    //server.connections是一个数组，包含所有连接进来的客户端
    const data = JSON.parse(msg);
    const cmd = data.cmd;
    server.connections.forEach(function(conn) {
        //connection.sendText方法可以发送指定的内容到客户端，传入一个字符串
        //这里为遍历每一个客户端为其发送内容
        conn.sendText(msg);
    });
    switch (cmd) {
        case cmd.send_msg:
            console.log(data);
            server.connections.forEach(function(conn) {
                //connection.sendText方法可以发送指定的内容到客户端，传入一个字符串
                //这里为遍历每一个客户端为其发送内容
                conn.sendText(JSON.stringify({
                    cmd: event.send_msg,
                    msg: data.msg,
                    id: data.id,
                }));
            });
            break;
        default:
            break;
    };
}
