'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, viewFactory, config, eventService, win) {
	
	var groups = [];
	
	function getGroupById(groupId) {
		for (var i = 0, len = groups.length; i < len; i++) {
			if (groups[i].id === groupId) return groups[i];
		}
	}
	
	
	
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
		
		eventService.subscribe(eventService.events.group.selected, function(e) {
			var group = getGroupById(e.detail.groupId);
			var groupSummaryView = viewFactory.makeGroupSummaryView(group);
		});	
		
		eventService.subscribe(eventService.events.group.deleted, function(e) {
			var group = getGroupById(e.detail.groupId);
			var index = groups.indexOf(group);
			if (index > -1) {
				groups.splice(index, 1);
			}
			e.preventDefault();
		});
		
		
	}
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(groupFactory.createGroup(storedGroups[i]));
			}
		}
		
		var groupsNavigationView = viewFactory.makeNavigationView(groups, groupFactory);
		
		if (groups.length == 0) {
			createGroupForCurrentWeek();			
		}
		
		groupsNavigationView.makeGroupNavigation(groups);
		
		if (groups.length > 0) {
			var lastGroup = groups[groups.length - 1];
			eventService.dispatch(eventService.events.group.selected, { 'detail' : { 'group' : lastGroup, 'groupId' : lastGroup.id }});
		}
	}
	
	function init() {
		bind();		
		eventService.subscribe(eventService.events.sync.groupsRetrieved, groupsRetrievedEventHandler);
		eventService.dispatch(eventService.events.sync.getGroups);
	}
	
	init();
	
})(logger, tt.groupFactory, tt.viewFactory, tt.config, tt.eventService, this);