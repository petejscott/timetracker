'use strict';

var logger = (function(win) {

	var CONST_LOGLEVEL_DEBUG = 4;
	var CONST_LOGLEVEL_INFO = 3;
	var CONST_LOGLEVEL_WARNING = 2;
	var CONST_LOGLEVEL_ERROR = 1;
	var CONST_LOGLEVEL_NONE = 0;
	
	var logLevel = CONST_LOGLEVEL_WARNING;
	
	function logDebug(data) {
		if (logLevel < 4) return;
		log(data);
	}
	function logInfo(data) {
		if (logLevel < 3) return;
		log(data);
	}
	function logWarning(data) {
		if (logLevel < 2) return;
		log(data);
	}
	function logError(data) {
		if (logLevel < 1) return;
		log(data);
	}
	
	function log(data) {
		if (win.console && win.console.log) {
			win.console.log(data);
		}
	}
	
	return {
		logDebug : logDebug,
		logInfo : logInfo,
		logWarning: logWarning,
		logError : logError
	};

})(this);