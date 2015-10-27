'use strict';

var tt = tt || {};
tt.app = (function(logger, groupFactory, taskFactory, viewFactory, eventService) {

	var appData = new AppData();
    Object.seal(appData);
    appData.setConfig(tt.config);
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
                appData.addGroup(groupFactory.createGroup(storedGroups[i]));
			}
		}
		createViews();
	}
	
	function createViews() {
		viewFactory.makeNavigationView(appData, groupFactory, taskFactory);
		viewFactory.makeSyncStatusView(groupSync);
	}
	
	function groupSync() {
		eventService.dispatch(eventService.events.sync.requested,  { 
			'detail' : 
			{ 
				'type' : 'groups',
				'data' : appData.groups,
				'priority' : 'high' 
			}
		});
	}
	
	eventService.subscribe(eventService.events.sync.groupsRetrieved, groupsRetrievedEventHandler);
	eventService.dispatch(eventService.events.sync.getGroups);
	
})(logger, tt.groupFactory, tt.taskFactory, tt.viewFactory, tt.eventService);