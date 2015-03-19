"use strict"

var win = false;

function open_window(){
	win = window.open(base_url, '_self', 'location=no');
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