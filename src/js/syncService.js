'use strict';

var tt = tt || {};
tt.syncService = (function(logger, ui, storage, win) {
	
	var GROUP_STORAGE_KEY = 'tt-groups';
	var HIGH_PRIORITY_SYNC_SECONDS = 2;
	var LOW_PRIORITY_SYNC_SECONDS = 15;
	
	var syncTimeout = null;
	var secondsUntilSync = null;
	var dataToSync = null;
	
	function getDataToSync() {
		return dataToSync;
	}
	
	function setSyncRequest() {
		if (syncTimeout !== null) win.clearTimeout(syncTimeout);
		syncTimeout = win.setTimeout(function(e) {
			syncGroups(getDataToSync());
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'up-to-date' }));
			secondsUntilSync = null;
		}, (secondsUntilSync*1000));
	}
	
	function requestSync(seconds, data) {
		
		dataToSync = data;
		
		if (secondsUntilSync === null || secondsUntilSync > seconds) {
			
			logger.logDebug("changed secondsUntilSync from " + secondsUntilSync + " to " + seconds);
			secondsUntilSync = seconds;
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'preparing to sync ('+ seconds +')' }));
			setSyncRequest();
		}
		
	}
	
	function bindSyncRequest() {
		ui.mainContainer.addEventListener('sync-requested', function(e) {
			
			var data = e.detail.data;
			if (data === null || typeof(data) === 'undefined') {
				throw 'No data (detail.data) provided to sync-requested event';
			}
			
			if (e.detail.priority === 'high') {
				requestSync(HIGH_PRIORITY_SYNC_SECONDS, data);
			} else if (e.detail.priority === 'low') {
				requestSync(LOW_PRIORITY_SYNC_SECONDS, data);
			}
			else {
				throw 'Unknown or no priority (detail.priority) requested for sync-requested event';
			}
		});
	}
	
	function init() {
		bindSyncRequest();
	}
	
	function syncGroups(groups) {
		logger.logDebug('syncing... '+JSON.stringify(groups));
		storage.set(GROUP_STORAGE_KEY, JSON.stringify(groups));
	}
	
	function getGroups() {
		return JSON.parse(storage.get(GROUP_STORAGE_KEY));
	}
	
	function removeGroups() {
		storage.remove(GROUP_STORAGE_KEY);
	}
	
	init();
	
	return {
		syncGroups: syncGroups,
		getGroups: getGroups,
		removeGroups: removeGroups 
	}
	
})(logger, tt.ui, tt.storage, this);