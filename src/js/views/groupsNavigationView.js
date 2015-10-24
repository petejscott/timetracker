'use strict';

function groupsNavigationView(groups, eventService) {
	this.groups = groups;
	this.eventService = eventService;
	this.groupNavigationContainer = document.querySelector("#groupContainer ul");
}

groupsNavigationView.prototype.makeGroupNavigation = function() {
	this.groupNavigationContainer.textContent = "";
	for (var i = 0, len = this.groups.length; i < len; i++) {
		this.appendGroupToGroupNavigation(this.groups[i]);
	}
}
groupsNavigationView.prototype.removeGroupFromGroupNavigation = function(group) {
	var groupNavElement = this.groupNavigationContainer.querySelector("li[data-groupid='" + group.id + "']");
	groupNavElement.remove();
}
groupsNavigationView.prototype.appendGroupToGroupNavigation = function(group) {	
	var groupNavElement = this.makeGroupNavElement(group);
	this.groupNavigationContainer.appendChild(groupNavElement);
}
groupsNavigationView.prototype.updateGroupTotalInGroupNavigation = function(group) {
	var groupNavElement = this.groupNavigationContainer.querySelector("li[data-groupid='" + group.id + "']");
	var groupTotalElement = groupNavElement.querySelector(".group-total");
	groupTotalElement.textContent = group.total;
}
groupsNavigationView.prototype.updateGroupNameInGroupNavigation = function(group) {
	var groupNavElement = this.groupNavigationContainer.querySelector("li[data-groupid='" + group.id + "']");
	var groupNameElement = groupNavElement.querySelector(".group-title");
	groupNameElement.textContent = group.title;
	groupNameElement.setAttribute("title", "View group (" + group.title + ")");
}
groupsNavigationView.prototype.makeGroupNavElement = function(group) {
	var thisView = this;
	
	var groupListItem = document.createElement("li");
	groupListItem.setAttribute("data-groupid", group.id);
	
	var groupAnchor = document.createElement("a");
	groupAnchor.classList.add("group-title");
	groupAnchor.setAttribute("href", "#" + group.id);
	groupAnchor.setAttribute("title", "View group (" + group.title + ")");
	groupAnchor.addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.selected, { 'detail' : { 'group' : group, 'groupId' : group.id }});
		e.preventDefault();
	}, false);
	
	var groupText = document.createTextNode(group.title + " ");
	
	var groupTotal = document.createElement("span");
	groupTotal.classList.add("group-total");
	groupTotal.classList.add("paren-data");
	groupTotal.textContent = group.total;		
	
	groupAnchor.appendChild(groupText);
	groupAnchor.appendChild(groupTotal);
	
	var groupDeleteAnchor = document.createElement("a");
	groupDeleteAnchor.classList.add("group-delete");
	groupDeleteAnchor.setAttribute("href", "#deletegroup");
	var groupDelete = document.createElement("i");
	groupDelete.classList.add("icon-cancel-circled");
	groupDelete.setAttribute("title", "Delete Group");
	groupDeleteAnchor.appendChild(groupDelete);
	groupDeleteAnchor.addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.deleted, { 'detail' : { 'group' : group, 'groupId' : group.id }});
		e.preventDefault();
	}, false);
	
	groupListItem.appendChild(groupAnchor);
	groupListItem.appendChild(groupDeleteAnchor);
	
	return groupListItem;
}