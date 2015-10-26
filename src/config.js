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
        "mainContainerQuery" : mainContainerQuery,
        "eventElementQuery" : eventElementQuery,
        "getMainContainer" : getMainContainer,
        "getEventElement" : getEventElement,
		"remoteSyncWebUrl" : remoteSyncWebUrl,
		"remoteSyncApiKey" : remoteSyncApiKey
    };

})(this);