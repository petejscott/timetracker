'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, viewFactory, eventService) {
	
	var groups = [];
	
	function bind() {
		
		var syncStatusView = viewFactory.makeSyncStatusView(function(e) {
			eventService.dispatch(eventService.events.sync.requested,  { 
				'detail' : 
				{ 
					'type' : 'groups',
					'data' : groups,
					'priority' : 'high' 
				}
			})
		});
	}
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(groupFactory.createGroup(storedGroups[i]));
			}
		}
		
		var navigationView = viewFactory.makeNavigationView(groups, groupFactory);
		bind();
	}
	
	function init() {
		eventService.subscribe(eventService.events.sync.groupsRetrieved, groupsRetrievedEventHandler);
		eventService.dispatch(eventService.events.sync.getGroups);
	}
	
	init();
	
})(logger, tt.groupFactory, tt.viewFactory, tt.eventService);