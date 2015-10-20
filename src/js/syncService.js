'use strict';

var tt = tt || {};
tt.syncService = (function(logger, config, eventService, storage, win) {
	
	var GROUP_STORAGE_KEY = 'tt-groups';
	var HIGH_PRIORITY_SYNC_SECONDS = 1;
	var LOW_PRIORITY_SYNC_SECONDS = 15;
	
	var syncTimeout = null;
	var syncUiInterval = null;
	var secondsUntilSync = null;
	var dataToSync = null;
	
	function getDataToSync() {
		return dataToSync;
	}
	
	function setSyncRequest() {
		if (syncTimeout !== null) win.clearTimeout(syncTimeout);
		syncTimeout = win.setTimeout(function(e) {
			syncGroups(getDataToSync());
			secondsUntilSync = null;
			setUpToDateSyncUI();
		}, (secondsUntilSync*1000));
	}
	
	function requestSync(seconds, data) {
		
		dataToSync = data;
		
		if (secondsUntilSync === null || secondsUntilSync > seconds) {
			logger.logDebug("changed secondsUntilSync from " + secondsUntilSync + " to " + seconds);
			secondsUntilSync = seconds;
			
			updatePendingSyncUI();
			if (syncUiInterval !== null) win.clearInterval(syncUiInterval);
			syncUiInterval = win.setInterval(updatePendingSyncUI, 1000);
			
			setSyncRequest();
		}
	}
	
	function setUpToDateSyncUI() {
		if (syncUiInterval !== null) win.clearInterval(syncUiInterval);
		eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'up-to-date' });
	}
	
	function updatePendingSyncUI() {
		secondsUntilSync -= 1;
		eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'preparing to sync... ('+ secondsUntilSync +')' });
	}
	
	function syncRequestHandler(e) {
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
	}
	
	function bindSyncRequest() {
		eventService.subscribe(eventService.events.sync.requested, syncRequestHandler);
	}
	
	function init() {
		bindSyncRequest();
		
		eventService.subscribe(eventService.events.sync.statusUpdated, function(e) {
			config.mainContainer.querySelector('.sync-status').textContent = e.detail;
		});
		
		setUpToDateSyncUI();
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
		syncGroups,
		getGroups,
		removeGroups 
	}
	
})(logger, tt.config, tt.eventService, tt.storage, this);