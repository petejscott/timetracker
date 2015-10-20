'use strict';

var tt = tt || {};
tt.storage = (function(logger) {

	function set(key, data) {
		logger.logDebug('set ' + key + ' to ' + data);
		localStorage.setItem(key, data);
	}
	
	function get(key) {
		var result = localStorage.getItem(key);
		logger.logDebug('get ' + key + ' as ' + result);
		return result;
	}
	
	function remove(key) {
		logger.logWarning('removed ' + key);
		localStorage.removeItem(key);
	}
	
	return {
		set,
		get,
		remove
	}

})(logger);
