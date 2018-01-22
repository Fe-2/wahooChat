$(document).ready(function(){
    var ws = new WebSocket('ws://sqy3l5z.hk1.mofasuidao.cn');
    ws.onopen = function() { // websocket开启连接的回调函数

         };
    ws.onmessage = function(evt) { // websocket响应服务端数据的回调函数
        onmsg(evt.data);
    };
    ws.onclose = function() { // 服务器断开连接的回调函数

    };
    ws.onerror = function(evt) { // websocket连接失败的回调函数


    };
    var name = '';
    var cmd = {
            login: 600,
            send_msg : 601,
        },
        event = {
            login: 800,
            send_msg : 801,
        };
    $('.textarea').on('focus',function () {
        setTimeout(function(){
            $('body').scrollTop(1000000*12);
        },300);
    })
    $('.sub').on('click',function(){
        name = $('.user').val().trim();
        if (name) {
            $('.mask').fadeOut();
            ws.send(JSON.stringify({
                cmd: cmd.login,
                id: name,
            }))
        }
    });
    /*
    * 发送消息
    * */
    $('.send').on('click',function(){
       var text = $('.textarea'),
           content = encodeScript(text.html().trim());
       if (content) {
           ws.send(JSON.stringify({
               cmd: event.send_msg,
               msg: content,
               id: name,
           }));
           text.html('');
       }
    });
    /**
     * 响应websocket
     * */
    function onmsg(msg) {
        var data = JSON.parse(msg);
        var events = data.cmd;
        var id = data.id;
        switch (events){
            case event.send_msg:
                var html = '';
               if (id === name) {
                   html += '<div class="right">';
               } else {
                   html += '<div class="left">';
               }
               html += '<div class="left">'+
                   '<p class="info"><span>'+id+'</span></p>'+
                   '<div class="detail">'+data.msg+'</div></div>';
                $('.message').append(html);
                setTimeout(function(){
                    $('.message').scrollTop(100000*123);
                },0);
                break;
            default:
                break;
        };
    }
});
function encodeScript(data) {
    if (null === data || "" === data) {
        return "";
    }
    return data.replace("<", "&lt;").replace(">", "&gt;");
}