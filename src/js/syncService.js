'use strict';

var tt = tt || {};
tt.syncService = (function(logger, ui, storage, win) {
	
	var GROUP_STORAGE_KEY = 'tt-groups';
	
	function syncGroups(groups) {
		logger.logDebug('syncing...');
		storage.set(GROUP_STORAGE_KEY, JSON.stringify(groups));
		ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'up-to-date' }));
	}
	
	function getGroups() {
		return JSON.parse(storage.get(GROUP_STORAGE_KEY));
	}
	
	function removeGroups() {
		storage.remove(GROUP_STORAGE_KEY);
	}
	
	return {
		syncGroups: syncGroups,
		getGroups: getGroups,
		removeGroups: removeGroups 
	}
	
})(logger, tt.ui, tt.storage, this);