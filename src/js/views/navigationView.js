'use strict';

function navigationView(groups, eventService, groupFactory, taskFactory, viewFactory) {
	
	var groups = groups;
	var eventService = eventService;
	var groupFactory = groupFactory;
	var viewFactory = viewFactory;
	var groupNavigationContainer = document.querySelector("#mainNavigation ul.group-nav");
	var optionsNavigationContainer = document.querySelector("#mainNavigation ul.options-nav");
	
	this.groups = groups;
	this.eventService = eventService;
	this.groupFactory = groupFactory;
	this.viewFactory = viewFactory;
	this.groupNavigationContainer = document.querySelector("#mainNavigation ul.group-nav");
	this.optionsNavigationContainer = document.querySelector("#mainNavigation ul.options-nav");
	
	setGroupEventHandling();
	this.element = makeNavigation();
	
	function getGroupById(groupId) {
		for (var i = 0, len = groups.length; i < len; i++) {
			if (groups[i].id === groupId) return groups[i];
		}
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewGroup();
		groups.push(group);
		eventService.dispatch(eventService.events.group.added, { 'detail' : { 'group' : group, 'groupId' : group.id }});
	}
	
	function setGroupEventHandling() {
		eventService.subscribe(eventService.events.group.added, function(e) {
			var group = getGroupById(e.detail.groupId);
			addGroupToNavigation(group);
			group.publish('select-group', { 'group' : group });
			e.preventDefault();
		});
	}
	
	function addGroupToNavigation(group) {
		group.subscribe('delete-group', removeGroupFromNavigation);
		group.subscribe('select-group', setGroupAsActiveGroup);
		var groupNavigationView = viewFactory.makeGroupNavigationView(group);
		groupNavigationContainer.appendChild(groupNavigationView.getElement());
	}
	
	function removeGroupFromNavigation(e) {
		var index = groups.indexOf(e.detail.group);
		if (index > -1) {
			groups.splice(index, 1);
		}
	}
	
	function setGroupAsActiveGroup(e) {
		var activeGroup = e.detail.group;
		if (activeGroup !== null) {
			// TODO: neither of these view instantiations really belong in here.
			// consider moving group-select back to an event, communicating with app.js
			var view = viewFactory.makeTaskListView(activeGroup, taskFactory);
			var groupSummaryView = viewFactory.makeGroupSummaryView(activeGroup);
		}
	}
	
	function makeNavigation() {
		groupNavigationContainer.textContent = "";
		
		if (groups.length == 0) {
			createGroupForCurrentWeek();		
		}
		for (var i = 0, len = groups.length; i < len; i++) {
			addGroupToNavigation(groups[i]);
		}
		if (groups.length > 0) {
			var lastGroup = groups[groups.length - 1];
			lastGroup.publish('select-group', { 'group' : lastGroup });
		}
		
		optionsNavigationContainer.innerHTML = '<li><a href="#group-add" title="Add a Group" class="action-group-add icon-plus-circled">Add a Group</a></li>';
		optionsNavigationContainer.querySelector('.action-group-add').addEventListener('click', function(e) {
			createGroupForCurrentWeek();
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			e.preventDefault();
		}, false);
	}
}

navigationView.prototype.getElement = function() {
	return this.element;
}