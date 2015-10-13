'use strict';

var tt = tt || {};
tt.groupService = (function(logger, taskGroupFactory, taskService, ui, storage, win) {
	
	var groups = [];
	
	var groupContainer = document.querySelector("#groupContainer");
	
	function createGroupNavElement(group) {
		var groupAnchor = win.document.createElement("a");
		groupAnchor.setAttribute("href", "#" + group.id);
		groupAnchor.setAttribute("title", "View group (" + group.name + ")");
		groupAnchor.addEventListener('click', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('group-selected', { 'detail' : group }));
			e.preventDefault();
		}, false);
		
		var groupText = win.document.createTextNode(group.name + " ");
		
		var groupTotal = win.document.createElement("span");
		groupTotal.classList.add("paren-data");
		groupTotal.textContent = group.total;
		
		var groupListItem = win.document.createElement("li");
		
		groupAnchor.appendChild(groupText);
		groupAnchor.appendChild(groupTotal);
		groupListItem.appendChild(groupAnchor);
		
		return groupListItem;
	}
	
	function renderGroupNavigation(groups) {
		var navList = win.document.querySelector('nav#groupContainer ul:first-child');
		ui.clearElement(navList);
		for (var i = 0, len = groups.length; i < len; i++) {
			var groupNavElement = createGroupNavElement(groups[i]);
			navList.appendChild(groupNavElement);
		}
	}
	
	function renderCurrentGroupSummary(group) {
		
		var currentGroupNameElement = win.document.querySelector(".group-name");
		currentGroupNameElement.textContent = group.name;
		currentGroupNameElement.addEventListener('keypress', function(e) {
			if (e.keyCode === 13) {
				ui.mainContainer.dispatchEvent(new CustomEvent('group-changed', { 'detail': group }));
				e.preventDefault();
			}
		})
		currentGroupNameElement.addEventListener('input', function(e) {
			group.name = currentGroupNameElement.textContent;			
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			e.preventDefault();
		}, false);
		
		var currentGroupTotalElement = win.document.querySelector(".group-total");
		currentGroupTotalElement.textContent = group.total;
	}
	
	function createGroupForCurrentWeek() {
		var group = taskGroupFactory.createNewTaskGroup();
		groups.push(group);
		ui.mainContainer.dispatchEvent(new CustomEvent('group-added', { 'detail' : group }));
		ui.mainContainer.dispatchEvent(new CustomEvent('group-selected', { 'detail' : group }));
	}
	
	function bind() {
		bindSyncStatus();
		bindGroupAddedEventListener();
		bindGroupChangedEventListener();
		bindNewGroupAction();
		bindDeleteAllGroupsAction();
	}
	
	function bindSyncStatus() {
		ui.mainContainer.querySelector('.sync-status').addEventListener('click', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('group-changed'));
		});
		
		ui.mainContainer.addEventListener('sync-status', function(e) {
			ui.mainContainer.querySelector('.sync-status').textContent = e.detail;
		});
	}
	
	function bindGroupAddedEventListener() {
		ui.mainContainer.addEventListener('group-added', function(e) {
			renderGroupNavigation(groups);
			e.preventDefault();
		}, false);
	}
	
	function bindDeleteAllGroupsAction() {
		var el = win.document.querySelector('.action-group-delete');
		el.addEventListener('click', function(e) {
			storage.remove('tt-groups');
			e.preventDefault();
		})
	}
	
	function bindNewGroupAction() {
		var els = win.document.querySelectorAll(".action-group-add");
		for (var i = 0, len = els.length; i < len; i++) {
			els[i].addEventListener('click', function(e) {
				createGroupForCurrentWeek();
				e.preventDefault();
			}, false);
		}
	}
	
	function bindGroupChangedEventListener() {
		ui.mainContainer.addEventListener('group-changed', function(e) {
			renderGroupNavigation(groups);
			if (e.detail) {
				renderCurrentGroupSummary(e.detail);
			}
			storage.set('tt-groups', JSON.stringify(groups));
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'up-to-date' }));
		});
	}
	
	function init() {		
		
		bind();
		
		var storedGroups = JSON.parse(storage.get('tt-groups'));
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
				groups.push(taskGroupFactory.createTaskGroup(storedGroups[i]));
			}
		}
		
		if (groups.length == 0) {
			createGroupForCurrentWeek();			
		}
		
		renderGroupNavigation(groups);
		renderCurrentGroupSummary(groups[0]);
		
		if (groups.length > 0) {
			var lastGroup = groups[groups.length - 1];
			ui.mainContainer.dispatchEvent(new CustomEvent('group-selected', { 'detail' : lastGroup }));
		}
		
		ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'up-to-date' }));
	}
	
	init();
	
})(logger, tt.taskGroupFactory, tt.taskService, tt.ui, tt.storage, this);