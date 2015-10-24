'use strict';

function navigationView(groups, eventService, groupFactory, viewFactory) {
	this.groups = groups;
	this.eventService = eventService;
	this.groupFactory = groupFactory;
	this.viewFactory = viewFactory;
	this.groupNavigationContainer = document.querySelector("#mainNavigation ul.group-nav");
	this.optionsNavigationContainer = document.querySelector("#mainNavigation ul.options-nav");
	
	this.element = this.makeNavigation(this);
	
	this.createGroupForCurrentWeek = function(view) {
		var group = view.groupFactory.createNewGroup();
		view.groups.push(group);
		view.eventService.dispatch(view.eventService.events.group.added, { 'detail' : { 'group' : group, 'groupId' : group.id }});
		view.eventService.dispatch(view.eventService.events.group.selected, { 'detail' : { 'group' : group, 'groupId' : group.id }});
	}
	
	this.setGroupEventHandling(this);
}

navigationView.prototype.getElement = function() {
	return this.element;
}

// TODO: this probably belongs in groupService, in which case groupService probably 
// becomes a dependency of THIS object, and groups no longer needs to be passed in 
// since we can just use groupService's groups collection.
navigationView.prototype.getGroupById = function(groupId) {
	for (var i = 0, len = this.groups.length; i < len; i++) {
		if (this.groups[i].id === groupId) return this.groups[i];
	}
}

navigationView.prototype.setGroupEventHandling = function(view) {
	
	view.eventService.subscribe(view.eventService.events.group.added, function(e) {
		var group = view.getGroupById(e.detail.groupId);
		view.addGroupToNavigation(group);
		e.preventDefault();
	});
	view.eventService.subscribe(view.eventService.events.group.selected, function(e) {
		var group = view.getGroupById(e.detail.groupId);
		var groupSummaryView = view.viewFactory.makeGroupSummaryView(group);
	});	
	
	view.eventService.subscribe(view.eventService.events.group.deleted, function(e) {
		var group = view.getGroupById(e.detail.groupId);
		var index = view.groups.indexOf(group);
		if (index > -1) {
			view.groups.splice(index, 1);
		}
		e.preventDefault();
	});
}

navigationView.prototype.addGroupToNavigation = function(group) {
	var groupNavigationView = this.viewFactory.makeGroupNavigationView(group);
	this.groupNavigationContainer.appendChild(groupNavigationView.getElement());
}

navigationView.prototype.makeNavigation = function(view) {
	this.groupNavigationContainer.textContent = "";
	
	if (this.groups.length == 0) {
		createGroupForCurrentWeek();			
	}
	for (var i = 0, len = this.groups.length; i < len; i++) {
		var groupNavigationView = this.viewFactory.makeGroupNavigationView(this.groups[i]);
		this.groupNavigationContainer.appendChild(groupNavigationView.getElement());
	}
	
	view.optionsNavigationContainer.innerHTML = '<li><a href="#group-add" title="Add a Group" class="action-group-add icon-plus-circled">Add a Group</a></li>';
	view.optionsNavigationContainer.querySelector('.action-group-add').addEventListener('click', function(e) {
		view.createGroupForCurrentWeek(view);
		view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
		e.preventDefault();
	}, false);
}