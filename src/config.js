'use strict';

var tt = tt || {};
tt.config = (function(win) {
	var mainContainer = win.document.querySelector("#main");
	var eventElement = mainContainer;
	var remoteSyncWebUrl = "";
	var remoteSyncApiKey = "";
	return { 
		mainContainer, 
		eventElement, 
		remoteSyncWebUrl, 
		remoteSyncApiKey };
})(this);