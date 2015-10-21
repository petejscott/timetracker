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
	
	var useRemoteSyncWebhook = false;
	var remoteSyncWebUrl = null;
	
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
	
	function remoteGroupsPost(jsonData) {
		var http = new XMLHttpRequest();
		var url = remoteSyncWebUrl;
		var params = "groupdata=" + jsonData;
		http.open("POST", url, true);

		http.setRequestHeader("Content-type", "application/json");
		http.setRequestHeader("X-Auth-Token", config.remoteSyncApiKey);
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status >= 200 && http.status < 400) {                
					logger.logDebug(http.status + " from remote: " + http.responseText);
				} else {
					logger.logError(http.status + " from remote: " + http.responseText);
				}
			}
		}
		http.send(params);
	}
	
	function init() {
		
		eventService.subscribe(eventService.events.sync.requested, syncRequestHandler);
		eventService.subscribe(eventService.events.sync.removeGroups, removeGroups);
		eventService.subscribe(eventService.events.sync.getGroups, getGroups);
		
		eventService.subscribe(eventService.events.sync.statusUpdated, function(e) {
			config.mainContainer.querySelector('.sync-status').textContent = e.detail;
		});
		
		if (typeof(config.remoteSyncWebUrl) !== 'undefined' && config.remoteSyncWebUrl != null && config.remoteSyncWebUrl.length > 0) {
			useRemoteSyncWebhook = true;
			remoteSyncWebUrl = config.remoteSyncWebUrl;
		}
		
		setUpToDateSyncUI();
	}
	
	function syncGroups(groups) {
		var jsonGroupData = JSON.stringify(groups);
		logger.logDebug('syncing... ' + jsonGroupData);
		storage.set(GROUP_STORAGE_KEY, jsonGroupData);
		if (useRemoteSyncWebhook) {
			remoteGroupsPost(jsonGroupData);
			console.log('remote post');
		}
	}
	
	function getGroups() {
		var groups = JSON.parse(storage.get(GROUP_STORAGE_KEY));
		eventService.dispatch(eventService.events.sync.groupsRetrieved, { 'detail' : groups });
	}
	
	function removeGroups() {
		storage.remove(GROUP_STORAGE_KEY);
	}
	
	init();
	
})(logger, tt.config, tt.eventService, tt.storage, this);