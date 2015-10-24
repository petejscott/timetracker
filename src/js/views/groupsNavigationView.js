'use strict';

function groupsNavigationView(groups, eventService, viewFactory) {
	this.groups = groups;
	this.eventService = eventService;
	this.viewFactory = viewFactory;
	this.groupNavigationContainer = document.querySelector("#groupContainer ul");
	
	this.onGroupAddedToNavigationEvent(this);
}

// TODO: this probably belongs in groupService, in which case groupService probably 
// becomes a dependency of THIS object, and groups no longer needs to be passed in 
// since we can just use groupService's groups collection.
groupsNavigationView.prototype.getGroupById = function(groupId) {
	for (var i = 0, len = this.groups.length; i < len; i++) {
		if (this.groups[i].id === groupId) return this.groups[i];
	}
}

groupsNavigationView.prototype.onGroupAddedToNavigationEvent = function(view) {
	view.eventService.subscribe(view.eventService.events.group.added, function(e) {
		var group = view.getGroupById(e.detail.groupId);
		view.addGroupToNavigation(group);
		e.preventDefault();
	});
}

groupsNavigationView.prototype.addGroupToNavigation = function(group) {
	var groupNavigationView = this.viewFactory.makeGroupNavigationView(group);
	this.groupNavigationContainer.appendChild(groupNavigationView.getElement());
}

groupsNavigationView.prototype.makeGroupNavigation = function() {
	this.groupNavigationContainer.textContent = "";
	for (var i = 0, len = this.groups.length; i < len; i++) {
		var groupNavigationView = this.viewFactory.makeGroupNavigationView(this.groups[i]);
		this.groupNavigationContainer.appendChild(groupNavigationView.getElement());
	}
}