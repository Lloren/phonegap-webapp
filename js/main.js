"use strict"

var win = false;

function open_window(){
	win = window.open(base_url, "_self", "location=no");
	win.addEventListener("exit", function (){
		open_window();
	});
}

$(function (){
	$(window).on("message", function(event) {
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