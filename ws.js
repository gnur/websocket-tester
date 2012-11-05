function createWindow(){
    var aantal = ws.windows.length;
    var newwindow = aantal;
    console.log(newwindow);
    var newwindowhtml = ws.windowhtml.replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow).replace("##NUMBER##", newwindow);
    var newdiv = $(newwindowhtml);
    $("body").append(newdiv);
    ws.windows.push($("#websock" + newwindow));
    $("#websock" + newwindow).resizable();
    $("#websock" + newwindow).draggable({ stack: ".sockwindow"});
    $("#websock" + newwindow).attr("nummer", newwindow);
}

    var conn;
    var msg = $("#msg");
    var log = $("#log");
    msg.focus();

    function appendLog(div,msg) {
        var d = log[0]
        var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
        msg.appendTo(div)
        if (doScroll) {
            d.scrollTop = d.scrollHeight - d.clientHeight;
        }
    }

    $("#form").submit(function() {
        var nummer = $(this).parent().attr("nummer")
        if (!ws.conns[nummer]) {
            connect(msg.val());
            return false;
        }
        if (!msg.val()) {
            return false;
        }
        ws.conns[nummer].send(msg.val());
        msg.val("");
        return false
    });

    function connect(url) {
        if (window["WebSocket"]) {
            conn = new WebSocket("ws://" + url);
            conn.onopen = function(evt) {
                appendLog($("<div><strong>Connection opened..</strong></div>"));
            };
            conn.onclose = function(evt) {
                appendLog($("<div><b>Connection closed.</b></div>"));
                conn = false;
            };
            conn.onmessage = function(evt) {
                appendLog($("<div/>").text(evt.data))
            };
        } else {
            appendLog($("<div><b>Your browser does not support WebSockets.</b></div>"));
        }
    }
$(function() {
    ws = {};
    ws.conns = [];
    ws.windows = [];
    ws.windowhtml = "<div id=websock##NUMBER## class=sockwindow><div class=log id=log##NUMBER##></div><form class=form id=form##NUMBER##><table cellpadding=0 cellspacing=0 width=100%><tr><td style='width:20px;'><input type=submit /></td><td><input type=text class=command id=msg##NUMBER## /></td></tr></table></form></div>";

    $("#newwindow").click(function() {
        createWindow();
        console.log("creating new");
        return false;
    });
});
