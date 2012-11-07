function createWindow(){
    var aantal = ws.windows.length;
    var newwindow = aantal;
    var newwindowhtml = ws.windowhtml.replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow);
    var newdiv = $(newwindowhtml);
    $("body").append(newdiv);
    ws.windows.push($("#websock" + newwindow));
    $("#websock" + newwindow).resizable();
    $("#websock" + newwindow).draggable({ stack: ".sockwindow"});
    $("#websock" + newwindow).attr("nummer", newwindow);
    $("#form" + newwindow).submit(function(event) {
        event.preventDefault();
        var nummer = $(this).parent().attr("nummer")
        var msg = $("#msg" + nummer);
        if (!ws.conns[nummer]) {
            console.log('connectiong');
            connect(nummer, msg.val());
            msg.val("");
            return false;
        }
        if (!msg.val()) {
            return false;
        }
        ws.conns[nummer].send(msg.val());
        msg.val("");
        return false
    });
}


    function appendLog(nummer,msg) {
        var log = $("#log" + nummer);
        console.log(log);
        var d = log[0];
        var div = $("#msg" + nummer);
        var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
        msg.appendTo(log)
        if (doScroll) {
            d.scrollTop = d.scrollHeight - d.clientHeight;
        }
    }

    function connect(nummer, url) {
        if (window["WebSocket"]) {
            ws.conns[nummer]  = new WebSocket("ws://" + url);
            ws.conns[nummer].onopen = function(evt) {
                console.log(nummer);
                appendLog(nummer, $("<div><strong>Connection opened..</strong></div>"));
            };
            ws.conns[nummer].onclose = function(evt) {
                appendLog(nummer, $("<div><b>Connection closed.</b></div>"));
                ws.conns[nummer] = false;
            };
            ws.conns[nummer].onmessage = function(evt) {
                console.log(nummer);
                appendLog(nummer, $("<div/>").text(evt.data))
            };
        } else {
            appendLog(nummer, $("<div><b>Your browser does not support WebSockets.</b></div>"));
        }
    }
$(function() {
    ws = {};
    ws.conns = [];
    ws.windows = [];
    ws.windowhtml = "<div id=websock##NUMBER## class=sockwindow><div class=log id=log##NUMBER##></div><form class=form id=form##NUMBER##><table cellpadding=0 cellspacing=0 width=100%><tr><td style='width:20px;'><input type=submit /></td><td><input type=text class=command id=msg##NUMBER## /></td></tr></table></form></div>";

    $("#newwindow").click(function() {
        createWindow();
        return false;
    });
});
