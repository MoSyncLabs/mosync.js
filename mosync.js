/*
Copyright (C) 2011 MoSync AB

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License,
version 2, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
MA 02110-1301, USA.
*/

// The way this is done probably needs to be modified a bit.
// Now all different modules are loaded sequentially in the dependency order
// and the global namespace is filled with different functions.

function includeJS(jsPath, onload) {
	var scripts = document.getElementsByTagName('script');
	var thisScript = scripts[scripts.length-1];
	console.log("src: " + thisScript.src);
	var path = thisScript.src.replace(/\/[_a-zA-Z0-9]*\.js$/, '/'); 
	console.log("path: " + path + jsPath);
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", path + jsPath);
	script.addEventListener( "load", onload, false );
	document.getElementsByTagName("head")[0].appendChild(script);
}		

function loadEverything(mainInit) {

includeJS("mosync_core.js", function() {
includeJS("base64.js", function() {
includeJS("mosync_runtime.js", function() {
includeJS("maapi.js", function() {
includeJS("mosync_fast_vm_loop.js", function() {
includeJS("mosync_opengl.js", function() {
	mainInit();
}); // mosync_opengl.js
}); // mosync_fast_vm_loop.js
}); // maapi.js
}); // mosync_runtime.js
}); // base64.js
}); // mosync_core.js
}

function _start(program, resources) {
	loadEverything(function() {
		core = new Core();
		core.init(program, resources);
		core.start();
	});
}