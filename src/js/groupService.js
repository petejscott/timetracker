'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, viewFactory, config, eventService, win) {
	
	var editableTimeoutId = 0;
	var groups = [];
	var groupsNavigationView = null;
	
	function getGroupById(groupId) {
		for (var i = 0, len = groups.length; i < len; i++) {
			if (groups[i].id === groupId) return groups[i];
		}
	}
	
	function setGroupSummaryName(group) {
		var nameElement = win.document.querySelector("h2 span.group-title");
		nameElement.textContent = group.title;
	}
	
	function setGroupSummaryTime(group) {		
		var totalElement = win.document.querySelector("h2 span.group-total");
		totalElement.textContent = group.total;
	}
	
	function bindGroupNameEditToCurrentGroup(group) {
		
		var currentGroupNameElement = win.document.querySelector("header .group-title");

		currentGroupNameElement.addEventListener('input', function(e) {
			
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			group.title = currentGroupNameElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				group.publish('group-detail-changed', { 'group' : group, 'groupId' : group.id });
				eventService.dispatch(eventService.events.group.detailChanged, { 'detail' : { 'group' : group, 'groupId' : group.id }});
			}, 1500);
			
		}, false);
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewGroup();
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
		eventService.subscribe(eventService.events.group.added, function(e) {
			requestSync('high');
		});
		eventService.subscribe(eventService.events.group.timeChanged, function(e) {
			requestSync('low');
		});
		eventService.subscribe(eventService.events.group.deleted, function(e) {
			requestSync('low');
		});
	}
	
	function bindGroupInterfaceRequests() {
		
		config.mainContainer.querySelector('.sync-status').addEventListener('click', function(e) {
			requestSync('high');
		});
		
		// This seems a better fix for an editorService? Assuming config will be editable as well.
		config.menuContainer.querySelector('.action-groups-edit').addEventListener('click', function(e) {
			config.dataEditor.querySelector('.editor').textContent = JSON.stringify(groups);
			config.dataEditor.classList.remove('hidden');
		});
		config.dataEditor.querySelector('.action-cancel-editor').addEventListener('click', function(e) {
			config.dataEditor.querySelector('.editor').textContent = "";
			config.dataEditor.classList.add('hidden');
		});
		// End
		
		eventService.subscribe(eventService.events.group.detailChanged, function(e) {
			groupsNavigationView.updateGroupNameInGroupNavigation(e.detail.group);
		});
		
		eventService.subscribe(eventService.events.group.timeChanged, function(e) {
			var group = getGroupById(e.detail.groupId);
			groupsNavigationView.updateGroupTotalInGroupNavigation(group);
			setGroupSummaryTime(group);
		});
		
		eventService.subscribe(eventService.events.group.selected, function(e) {
			var group = getGroupById(e.detail.groupId);
			var groupSummaryView = viewFactory.makeGroupSummaryView(group);
			
		});
		
		eventService.subscribe(eventService.events.group.added, function(e) {
			var group = getGroupById(e.detail.groupId);
			groupsNavigationView.appendGroupToGroupNavigation(group);
			e.preventDefault();
		});
		
		eventService.subscribe(eventService.events.group.deleted, function(e) {
			var group = getGroupById(e.detail.groupId);
			groupsNavigationView.removeGroupFromGroupNavigation(group);
			var index = groups.indexOf(group);
			if (index > -1) {
				groups.splice(index, 1);
			}
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
				groups.push(groupFactory.createGroup(storedGroups[i]));
			}
		}
		
		groupsNavigationView = viewFactory.makeGroupsNavigationView(groups);
		
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