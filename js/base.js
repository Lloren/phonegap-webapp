"use strict"

var gaPlugin = false;
var storage_location = "";
var has_internet = false;
var uuid = "comp";

function dump(obj, name, pre, depth, ret) {
	ret = ret || false;
	pre = pre || "";
	name = name || "";
	depth = typeof depth !== "undefined" ? depth : 2;
	var out = "";
	if (typeof obj == "object" && depth > 0){
		var prop = false;
		for (var i in obj) {
			prop = true;
			out += dump(obj[i], name, pre+"["+i+"] ", depth-1, ret);
		}
		if (prop)
			return out;
		else
			out = "{}";
	} else {
		out += pre + (typeof obj) + ": " + obj;
	}
	if (ret)
		return name+"; "+out;
	console.log(name+"; "+out);
}

function ret_dump(obj, depth){
	depth = typeof depth !== "undefined" ? depth : 1;
	return dump(obj, "", "", depth, true);
}

function argdump() {
	for (var i = 0; i < arguments.length; ++i)
		alert(ret_dump(arguments[i]));
}

function open_modal(title, content, callback, button2, button1){
	content = content || "";
	title = title || "";
	callback = callback || false;
	button1 = button1 || "Ok";
	button2 = button2 || false;
	if (button2 === true)
		button2 = "Cancel";

	$("#modal h1").html(title);
	$("#modal p").html(content);
	$("#mbutton1").html(button1);
	if (button2){
		$("#mbutton1").removeClass("fullwidth");
		$("#mbutton2").show().html(button2);
	} else {
		$("#mbutton1").addClass("fullwidth");
		$("#mbutton2").hide();
	}
	$("#modal a").off().on("touchstart", function (e){
		$("#modal").hide();
		$("#disable-overlay").removeClass("enabled modal");
		if (callback)
			callback($(this).html());
	});
	$("#modal").show();
	$("#disable-overlay").addClass("enabled modal");
}

function open_modala(text) {
	$("#modal h1").html(text);
	$("#modal").addClass("loading").show();
	$("#disable-overlay").addClass("enabled modal");
}

function close_modala(){
	$("#modal").hide().removeClass("loading");
	$("#disable-overlay").removeClass("enabled modal");
}

function track(catigory, action, label, value){
	if (gaPlugin) {
		catigory = catigory || "Hit";
		action = action || catigory;
		label = label || action;
		value = value || 1;
		gaPlugin.trackEvent(false, false, catigory, action, label, value);
	}
}

var splash_checks = 3;
function start_splash_remove(){
	--splash_checks;
	if (splash_checks <= 0){
		setTimeout(function () { navigator.splashscreen.hide(); }, 100);
	}
}

function on_ready(){
	var thePlatform = "";
	if (typeof device != 'undefined'){
		navigator.splashscreen.show();
		thePlatform = device.platform.toLowerCase();

		storage_location = cordova.file.dataDirectory;

		gaPlugin = window.plugins.gaPlugin;

		gaPlugin.init(false, false, dev?"":ga_code, 10);
		track("Load", "load");

		if(ads && AdMob){
			var code = admob_code;
			if (typeof admob_code_droid != "undefined" && thePlatform == "android")
				code = admob_code_droid;
			AdMob.createBanner({adId:code, adSize:'SMART_BANNER', position:AdMob.AD_POSITION.BOTTOM_CENTER, autoShow:true, isTesting:dev, adExtras:{color_bg: '333333'}});
		}

		has_internet = navigator.connection.type != Connection.NONE;

		start_splash_remove();

		document.body.className = "v"+device.version.substr(0, 1)+" version"+device.version.replace(/\./g, "_");

		uuid = device.uuid;
	} else {
		thePlatform = "non-gap";
		has_internet = true;
	}
	if (thePlatform == "android"){
		document.body.id = "android";
	} else if (thePlatform == "wince"){
		document.body.id = "win";
	} else if (thePlatform == "non-gap"){
		document.body.id = "non-gap";
	} else if (thePlatform == "ios"){
		document.body.id = "ios";
		if (device.version.substr(0, 1) != "6")
			drawer.set_ios(true);
		uuid = window.localStorage.getItem("set_uuid");
		if (uuid === null){
			uuid = device.uuid;
			window.localStorage.setItem("set_uuid", uuid);
		}
	}
}

function online_check(){
	if (has_internet){
		return true;
	} else {
		open_modal("Notice<i class='fa fa-info-circle'></i>", "Internet access is required for this action.");
		return false;
	}
}

function onLoad(){
	document.addEventListener("deviceready", on_ready, false);
	document.addEventListener("online", function (){
		has_internet = navigator.connection.type != Connection.NONE;
	}, false);
	document.addEventListener("offline", function (){
		has_internet = navigator.connection.type != Connection.NONE;
	}, false);
	start_splash_remove();
}

function onunload(){
	track("Close", "close");
	if (gaPlugin) {
		gaPlugin.exit(false, false);
	}
}

$(function () {
	Origami.fastclick(document.body);
	on_ready();
});