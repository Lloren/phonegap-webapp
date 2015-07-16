"use strict"

var win = false;

function open_window(){
	win = navigator.app.loadUrl(base_url, {openExternal: true});
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