"use strict"

var win = false;

function open_window(){
	win = window.open(base_url, "_blank", "location=no");
	win.addEventListener( "loadstop", function() {
		alert("loadstop");
		win.executeScript({ code: "localStorage.setItem('message', '');" });
		var loop = setInterval(function() {
			alert("loop");
			win.executeScript({code: "localStorage.getItem('message');"}, function(values) {
					alert(values);
					var message = values[0];
					if (message) {
						win.executeScript({ code: "localStorage.setItem('message', '');" });
						message = $.parseJSON(message);
						if (message.action == "alert"){
							alert(message.data);
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
	window.addEventListener("message", function(event) {
		alert(event);
		if (event.origin == base_url && event.data.action) {
			if (event.data.action == "alert") {
				alert(event.data.data);
			}
		}
	}, false);
	if (has_internet){
		open_window();
	} else {
		$("body").html("This app requires internet to function.");
	}
});