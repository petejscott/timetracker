'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, groupHtmlFactory, taskService, config, eventService, syncService, win) {
	
	var editableTimeoutId = 0;
	var groups = [];
	
	var groupContainer = document.querySelector("#groupContainer");

	function renderGroupNavigation(groups) {
		var navList = groupContainer.querySelector('ul:first-child');
		navList.textContent = "";
		for (var i = 0, len = groups.length; i < len; i++) {
			var groupNavElement = groupHtmlFactory.makeGroupNavElement(groups[i]);
			navList.appendChild(groupNavElement);
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
		
		var currentGroupNameElement = win.document.querySelector(".group-name");

		currentGroupNameElement.addEventListener('input', function(e) {
			
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			group.name = currentGroupNameElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				eventService.dispatch(eventService.events.group.detailChanged, { 'detail' : group });
			}, 1500);
			
		}, false);
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewTaskGroup();
		groups.push(group);
		eventService.dispatch(eventService.events.group.added, { 'detail' : group });
		eventService.dispatch(eventService.events.group.selected, { 'detail' : group });
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
			renderGroupNavigation(groups);
		});
		
		eventService.subscribe(eventService.events.group.timeChanged, function(e) {
			renderGroupNavigation(groups);
			setGroupSummaryTime(e.detail);
		});
		
		eventService.subscribe(eventService.events.group.selected, function(e) {
			bindGroupNameEditToCurrentGroup(e.detail);
			setGroupSummaryName(e.detail);
			setGroupSummaryTime(e.detail);
		});
		
		eventService.subscribe(eventService.events.group.added, function(e) {
			renderGroupNavigation(groups);
			e.preventDefault();
		});
		
		var elDelete = win.document.querySelector('.action-group-delete');
		elDelete.addEventListener('click', function(e) {
			syncService.removeGroups();
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
	
	function init() {
		
		bind();
		
		var storedGroups = syncService.getGroups();
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(groupFactory.createTaskGroup(storedGroups[i]));
			}
		}
		
		if (groups.length == 0) {
			createGroupForCurrentWeek();			
		}
		
		renderGroupNavigation(groups);
		
		if (groups.length > 0) {
			var lastGroup = groups[groups.length - 1];
			eventService.dispatch(eventService.events.group.selected, { 'detail' : lastGroup });
		}
	}
	
	init();
	
})(logger, tt.groupFactory, tt.groupHtmlFactory, tt.taskService, tt.config, tt.eventService, tt.syncService, this);