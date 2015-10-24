'use strict';

function groupNavigationView(group, eventService) {
	this.group = group;
	this.eventService = eventService;
	this.element = this.makeGroupNavElement(getViewTemplate());
	
	this.onGroupTitleChangedEvent(this);
	this.bindToTaskTimeChanged(this);
	
	function getViewTemplate() {
		return 	'<a class="action-select-group" href="" title=""><span class="group-title"></span><span class="group-total paren-data"></span></a>' + 
				'<a class="action-delete-group" href="" title=""><i class="icon-cancel-circled"></i></a>';
	}
}

groupNavigationView.prototype.bindToTaskTimeChanged = function(view) {
	for (var i = 0, len = view.group.tasks.length; i < len; i++) {
		var t = view.group.tasks[i];
		t.subscribe('task-time-changed', function(e) { view.updateGroupTotal(view); });
	}
}

groupNavigationView.prototype.onGroupTitleChangedEvent = function(view) {
	this.group.subscribe('group-title-changed', function(e) { view.updateGroupTitle(view.group.title); });
}

groupNavigationView.prototype.getElement = function() {
	return this.element;
}

groupNavigationView.prototype.removeElement = function() {
	this.element.remove();
}
groupNavigationView.prototype.updateGroupTotal = function(view) {
	var groupTotalElement = view.getElement().querySelector(".group-total");
	groupTotalElement.textContent = view.group.total;
}
groupNavigationView.prototype.updateGroupTitle = function() {
	var groupNameElement = this.element.querySelector(".group-title");
	groupNameElement.textContent = this.group.title;
	groupNameElement.setAttribute("title", "View group (" + this.group.title + ")");
}

groupNavigationView.prototype.makeGroupNavElement = function(template) {
	
	var groupListItem = document.createElement("li");
	groupListItem.innerHTML = template;
	
	groupListItem.querySelector('.group-title').textContent = this.group.title;
	groupListItem.querySelector('.group-total').textContent = this.group.total;
	groupListItem.querySelector('.action-select-group').setAttribute('href', '#select-' + this.group.id);
	groupListItem.querySelector('.action-select-group').setAttribute('title', 'View group (' + this.group.title + ')');
	groupListItem.querySelector('.action-delete-group').setAttribute('href', '#delete-' + this.group.id);
	groupListItem.querySelector('.action-delete-group').setAttribute('title', 'View group (' + this.group.title + ')');
	
	var thisView = this;
	groupListItem.querySelector(".action-select-group").addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.selected, { 'detail' : { 'group' : thisView.group, 'groupId' : thisView.group.id }});
		e.preventDefault();
	}, false);
	
	groupListItem.querySelector(".action-delete-group").addEventListener('click', function(e) {
		thisView.eventService.dispatch(thisView.eventService.events.group.deleted, { 'detail' : { 'group' : thisView.group, 'groupId' : thisView.group.id }});
		thisView.element.remove();
		e.preventDefault();
	}, false);
	
	return groupListItem;
}