'use strict';

var tt = tt || {};
tt.config = (function(win) {
	var mainContainerQuery = "#main";
	var eventElementQuery = mainContainerQuery;
	var remoteSyncWebUrl = "";
	var remoteSyncApiKey = "";

    function getMainContainer() {
        return win.document.querySelector(mainContainerQuery);
    }

    function getEventElement() {
        return win.document.querySelector(eventElementQuery);
    }

	return {
        mainContainerQuery,
        eventElementQuery,
        getMainContainer,
        getEventElement,
		remoteSyncWebUrl, 
		remoteSyncApiKey };
})(this);