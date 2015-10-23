'use strict';

var tt = tt || {};
tt.config = (function(win) {
	var mainContainer = win.document.querySelector("#main");
	var menuContainer = win.document.querySelector("#menu");
	var dataEditor = win.document.querySelector("#data-editor");
	var eventElement = mainContainer;
	var remoteSyncWebUrl = "";
	var remoteSyncApiKey = "";
	return { 
		mainContainer, 
		menuContainer,
		dataEditor,
		eventElement, 
		remoteSyncWebUrl, 
		remoteSyncApiKey };
})(this);