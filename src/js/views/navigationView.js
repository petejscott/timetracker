'use strict';

function navigationView(logger, appDataInstance, eventService, groupFactory, taskFactory, viewFactory) {

    var appDataInstance = appDataInstance;
	var eventService = eventService;
	var groupFactory = groupFactory;
	var viewFactory = viewFactory;
	var groupNavigationContainer = document.querySelector("#mainNavigation ul.group-nav");
	var optionsNavigationContainer = document.querySelector("#mainNavigation ul.options-nav");


    if (groupNavigationContainer == null) {
        logger.logWarning("Missing navigationView.groupNavigationContainer");
        return;
    }
	
	setGroupEventHandling();
	this.element = makeNavigation();
	
	function getGroupById(groupId) {
		for (var i = 0, len = appDataInstance.groups.length; i < len; i++) {
			if (appDataInstance.groups[i].id === groupId) return appDataInstance.groups[i];
		}
	}
	
	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewGroup();
        appDataInstance.addGroup(group);
		eventService.dispatch(eventService.events.group.added, { 'detail' : { 'group' : group, 'groupId' : group.id }});
	}
	
	function setGroupEventHandling() {
		eventService.subscribe(eventService.events.group.added, function(e) {
			var group = getGroupById(e.detail.groupId);
			addGroupToNavigation(group);
			group.publish('select-group');
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
		var index = appDataInstance.groups.indexOf(e.target);
		if (index > -1) {
            appDataInstance.groups.splice(index, 1);
		}
	}
	
	function setGroupAsActiveGroup(e) {
		var activeGroup = e.target;
		if (activeGroup !== null) {
			// TODO: neither of these view instantiations really belong in here.
			// consider moving group-select back to an event, communicating with app.js
			var view = viewFactory.makeTaskListView(activeGroup, taskFactory);
			var groupSummaryView = viewFactory.makeGroupSummaryView(activeGroup);
		}
	}
	
	function makeNavigation() {

		groupNavigationContainer.textContent = "";
		
		if (appDataInstance.groups.length == 0) {
			createGroupForCurrentWeek();		
		}
		for (var i = 0, len = appDataInstance.groups.length; i < len; i++) {
			addGroupToNavigation(appDataInstance.groups[i]);
		}
		if (appDataInstance.groups.length > 0) {
			var lastGroup = appDataInstance.groups[appDataInstance.groups.length - 1];
			lastGroup.publish('select-group');
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