'use strict';

var tt = tt || {};
tt.app = (function(logger, groupFactory, taskFactory, viewFactory, eventService) {
	
	var groups = [];
	
	function groupSelectedEventHandler(e) {
		var activeGroup = e.detail.group;
		if (activeGroup !== null) {
			var view = viewFactory.makeTaskListView(activeGroup, taskFactory);
		}
		e.preventDefault();
	}
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(groupFactory.createGroup(storedGroups[i]));
			}
		}
		
		createViews();
	}
	
	function createViews() {
		var navigationView = viewFactory.makeNavigationView(groups, groupFactory);
		var syncStatusView = viewFactory.makeSyncStatusView(groupSync);
	}
	
	function groupSync() {
		eventService.dispatch(eventService.events.sync.requested,  { 
			'detail' : 
			{ 
				'type' : 'groups',
				'data' : groups,
				'priority' : 'high' 
			}
		});
	}
	
	eventService.subscribe(eventService.events.group.selected, groupSelectedEventHandler);
	eventService.subscribe(eventService.events.sync.groupsRetrieved, groupsRetrievedEventHandler);
	eventService.dispatch(eventService.events.sync.getGroups);
	
})(logger, tt.groupFactory, tt.taskFactory, tt.viewFactory, tt.eventService);