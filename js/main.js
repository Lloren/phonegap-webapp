"use strict"

var win = false;
var loop = false;

function open_window(){
	win = window.open(base_url, "_blank", "location=no, hidden=yes, EnableViewPortScale=yes");
	win.addEventListener("loadstart", function(e) {
		alert('loadstart');
	});
	win.addEventListener("loadstop", function(e) {
		alert('loadstop');
		win.executeScript({ code: "alert('load_stop');" });
		win.executeScript({ code: "localStorage.setItem('message', '');" });
		clearInterval(loop);
		loop = setInterval(function() {
			win.executeScript({code: "localStorage.getItem('message');"}, function(values) {
					var message = values[0];
					if (message) {
						win.executeScript({ code: "localStorage.setItem('message', '');" });
						message = $.parseJSON(message);
						if (message.action == "ret"){
							win.executeScript({ code: "localStorage.setItem('response', '"+message.data+"');" });
						}
					}
				}
			);
		}, 200);
	});
	win.addEventListener("exit", function (){
		open_window();
	});
}

$(function (){
	if (has_internet){
		open_window();
	} else {
		$("body").html("This app requires internet to function.");
	}
});