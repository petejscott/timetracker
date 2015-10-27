'use strict';

var tt = tt || {};
tt.config = (function() {
	var mainContainerQuery = "#main";
	var eventElementQuery = mainContainerQuery;
	var remoteSyncWebUrl = "";
	var remoteSyncApiKey = "";

    function getMainContainer() {
        return window.document.querySelector(mainContainerQuery);
    }

    function getEventElement() {
        return window.document.querySelector(eventElementQuery);
    }

	return {
        "mainContainerQuery" : mainContainerQuery,
        "eventElementQuery" : eventElementQuery,
        "getMainContainer" : getMainContainer,
        "getEventElement" : getEventElement,
		"remoteSyncWebUrl" : remoteSyncWebUrl,
		"remoteSyncApiKey" : remoteSyncApiKey
    };

})();