'use strict';

var tt = tt || {};
tt.groupService = (function(logger, groupFactory, groupHtmlFactory, taskService, ui, syncService, win) {
	
	var editableTimeoutId = 0;
	var groups = [];
	
	var groupContainer = document.querySelector("#groupContainer");

	function renderGroupNavigation(groups) {
		var navList = groupContainer.querySelector('ul:first-child');
		ui.clearElement(navList);
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
			
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			group.name = currentGroupNameElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				ui.mainContainer.dispatchEvent(new CustomEvent('group-detail-changed', { 'detail': group }));
			}, 1500);
			
		}, false);
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewTaskGroup();
		groups.push(group);
		ui.mainContainer.dispatchEvent(new CustomEvent('group-added', { 'detail' : group }));
		ui.mainContainer.dispatchEvent(new CustomEvent('group-selected', { 'detail' : group }));
	}
	
	function bind() {
		bindSyncStatus();
		bindSyncRequests();
		bindGroupInterfaceRequests();
	}
	
	function bindSyncStatus() {
		ui.mainContainer.querySelector('.sync-status').addEventListener('click', function(e) {
			requestSync('high');
		});
		
		ui.mainContainer.addEventListener('sync-status', function(e) {
			ui.mainContainer.querySelector('.sync-status').textContent = e.detail;
		});
	}
	
	function bindSyncRequests() {
		ui.mainContainer.addEventListener('group-detail-changed', function(e) {
			requestSync('high');
		});
		ui.mainContainer.addEventListener('group-collection-changed', function(e) {
			requestSync('high');
		});
		ui.mainContainer.addEventListener('group-time-changed', function(e) {
			requestSync('low');
		});
	}
	
	function bindGroupInterfaceRequests() {
		
		ui.mainContainer.addEventListener('group-detail-changed', function(e) {
			renderGroupNavigation(groups);
		});
		
		ui.mainContainer.addEventListener('group-time-changed', function(e) {
			renderGroupNavigation(groups);
			setGroupSummaryTime(e.detail);
		});
		
		ui.mainContainer.addEventListener('group-selected', function(e) {
			bindGroupNameEditToCurrentGroup(e.detail);
			setGroupSummaryName(e.detail);
			setGroupSummaryTime(e.detail);
		});
		
		ui.mainContainer.addEventListener('group-added', function(e) {
			renderGroupNavigation(groups);
			e.preventDefault();
		}, false);
		
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
		ui.mainContainer.dispatchEvent(new CustomEvent('sync-requested', 
		{ 
			'detail' : 
			{ 
				'type' : 'groups',
				'data' : groups,
				'priority' : priority 
			}
		}));
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
			ui.mainContainer.dispatchEvent(new CustomEvent('group-selected', { 'detail' : lastGroup }));
		}
		
		ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'up-to-date' }));
	}
	
	init();
	
})(logger, tt.groupFactory, tt.groupHtmlFactory, tt.taskService, tt.ui, tt.syncService, this);