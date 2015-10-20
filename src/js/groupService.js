'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, groupHtmlFactory, config, eventService, win) {
	
	var editableTimeoutId = 0;
	var groups = [];
	
	function getGroupById(groupId) {
		for (var i = 0, len = groups.length; i < len; i++) {
			if (groups[i].id === groupId) return groups[i];
		}
	}
	
	function setGroupSummaryName(group) {
		var nameElement = win.document.querySelector("h2 span.group-name");
		nameElement.textContent = group.name;
	}
	
	function setGroupSummaryTime(group) {		
		var totalElement = win.document.querySelector("h2 span.group-total");
		totalElement.textContent = group.total;
	}
	
	function bindGroupNameEditToCurrentGroup(group) {
		
		var currentGroupNameElement = win.document.querySelector("header .group-name");

		currentGroupNameElement.addEventListener('input', function(e) {
			
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			group.name = currentGroupNameElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				eventService.dispatch(eventService.events.group.detailChanged, { 'detail' : { 'group' : group, 'groupId' : group.id }});
				console.log('dispatched detailChanged');
			}, 1500);
			
		}, false);
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewTaskGroup();
		groups.push(group);
		eventService.dispatch(eventService.events.group.added, { 'detail' : { 'group' : group, 'groupId' : group.id }});
		eventService.dispatch(eventService.events.group.selected, { 'detail' : { 'group' : group, 'groupId' : group.id }});
	}
	
	function bind() {
		bindSyncRequests();
		bindGroupInterfaceRequests();
	}
	
	function bindSyncRequests() {
		eventService.subscribe(eventService.events.group.detailChanged, function(e) {
			requestSync('high');
		});
		eventService.subscribe(eventService.events.group.collectionChanged, function(e) {
			requestSync('high');
		});
		eventService.subscribe(eventService.events.group.timeChanged, function(e) {
			requestSync('low');
		});
	}
	
	function bindGroupInterfaceRequests() {
		
		config.mainContainer.querySelector('.sync-status').addEventListener('click', function(e) {
			requestSync('high');
		});
		
		eventService.subscribe(eventService.events.group.detailChanged, function(e) {
			groupHtmlFactory.updateGroupNameInGroupNavigation(e.detail.group);
		});
		
		eventService.subscribe(eventService.events.group.timeChanged, function(e) {
			var group = getGroupById(e.detail.groupId);
			groupHtmlFactory.updateGroupTotalInGroupNavigation(group);
			setGroupSummaryTime(group);
		});
		
		eventService.subscribe(eventService.events.group.selected, function(e) {
			var group = getGroupById(e.detail.groupId);
			bindGroupNameEditToCurrentGroup(group);
			setGroupSummaryName(group);
			setGroupSummaryTime(group);
		});
		
		eventService.subscribe(eventService.events.group.added, function(e) {
			var group = getGroupById(e.detail.groupId);
			groupHtmlFactory.appendGroupToGroupNavigation(group);
			e.preventDefault();
		});
		
		var elDelete = win.document.querySelector('.action-group-delete');
		elDelete.addEventListener('click', function(e) {
			eventService.dispatch(eventService.events.sync.removeGroups);
			e.preventDefault();
		});
		
		var elAdd = win.document.querySelector('.action-group-add');
		elAdd.addEventListener('click', function(e) {
			createGroupForCurrentWeek();
			e.preventDefault();
		}, false);
	}
	
	function requestSync(priority) {
		eventService.dispatch(eventService.events.sync.requested,  { 
			'detail' : 
			{ 
				'type' : 'groups',
				'data' : groups,
				'priority' : priority 
			}
		});
	}
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(groupFactory.createTaskGroup(storedGroups[i]));
			}
		}
		
		if (groups.length == 0) {
			createGroupForCurrentWeek();			
		}
		
		groupHtmlFactory.makeGroupNavigation(groups);
		
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
	
})(logger, tt.groupFactory, tt.groupHtmlFactory, tt.config, tt.eventService, this);