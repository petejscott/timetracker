'use strict';

function groupNavigationView(group, eventService) {
	this.group = group;
	this.eventService = eventService;
	this.element = this.makeGroupNavElement();
}

groupNavigationView.prototype.getElement = function() {
	return this.element;
}

groupNavigationView.prototype.removeElement = function() {
	this.element.remove();
}
groupNavigationView.prototype.updateGroupTotal = function() {
	var groupTotalElement = this.element.querySelector(".group-total");
	groupTotalElement.textContent = this.group.total;
}
groupNavigationView.prototype.updateGroupTitle = function() {
	var groupNameElement = this.element.querySelector(".group-title");
	groupNameElement.textContent = this.group.title;
	groupNameElement.setAttribute("title", "View group (" + this.group.title + ")");
}

groupNavigationView.prototype.makeGroupNavElement = function() {
	var groupListItem = document.createElement("li");
	
	var groupTitleSpan = '<span class="group-title">' + this.group.title + '</span>';
	var groupTotalSpan = '<span class="group-total paren-data">' + this.group.total + '</span>'
	
	var groupSelectAnchor = '<a class="action-select-group" href="#' + this.group.id + '" title="View group (' + this.group.title + ')">' + groupTitleSpan + groupTotalSpan + '</a>';
	var groupDeleteAnchor = '<a class="action-delete-group" href="#deletegroup-' + this.group.id + '" title="Delete group (' + this.group.title + ')"><i class="icon-cancel-circled"></i></a>';
	
	groupListItem.innerHTML = groupSelectAnchor + groupDeleteAnchor;
	
	var thisView = this;
	groupListItem.querySelector(".action-select-group").addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.selected, { 'detail' : { 'group' : thisView.group, 'groupId' : thisView.group.id }});
		e.preventDefault();
	}, false);
	
	groupListItem.querySelector(".action-delete-group").addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.deleted, { 'detail' : { 'group' : thisView.group, 'groupId' : thisView.group.id }});
		e.preventDefault();
	}, false);
	
	return groupListItem;
}