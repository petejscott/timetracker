'use strict';

function groupNavigationView(group, eventService) {
	this.group = group;
	this.eventService = eventService;
	this.element = this.makeGroupNavElement(getViewTemplate());
	
	this.onGroupTitleChangedEvent(this);
	this.subscribeToTaskTimeChanged(this);
	
	function getViewTemplate() {
		return 	'<a class="action-select-group" href="" title=""><span class="group-title"></span><span class="group-total paren-data"></span></a>' + 
				'<a class="action-delete-group" href="" title=""><i class="icon-cancel-circled"></i></a>';
	}
}

groupNavigationView.prototype.subscribeToTaskTimeChanged = function(view) {
	for (var i = 0, len = view.group.tasks.length; i < len; i++) {
		var t = view.group.tasks[i];
		t.subscribe('task-time-tick', function(e) { view.updateGroupTotal(view); });
	}
	//TODO: clean this up so it's more obvious (subscribe to task-time-tick on newly added tasks too)
	view.group.subscribe('task-added', function(e) {
		var newTask = e.detail.task;
		view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
		newTask.subscribe('task-time-tick', function(e) { view.updateGroupTotal(view); });
	});
}

groupNavigationView.prototype.onGroupTitleChangedEvent = function(view) {
	this.group.subscribe('change-group-title', function(e) { view.updateGroupTitle(view.group.title); });
}

groupNavigationView.prototype.getElement = function() {
	return this.element;
}

groupNavigationView.prototype.removeElement = function() {
	this.element.remove();
}
groupNavigationView.prototype.updateGroupTotal = function(view) {
	var groupTotalElement = view.getElement().querySelector(".group-total");
	groupTotalElement.textContent = view.group.getTotal();
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
	groupListItem.querySelector('.group-total').textContent = this.group.getTotal();
	groupListItem.querySelector('.action-select-group').setAttribute('href', '#select-' + this.group.id);
	groupListItem.querySelector('.action-select-group').setAttribute('title', 'View group (' + this.group.title + ')');
	groupListItem.querySelector('.action-delete-group').setAttribute('href', '#delete-' + this.group.id);
	groupListItem.querySelector('.action-delete-group').setAttribute('title', 'View group (' + this.group.title + ')');
	
	var thisView = this;
	groupListItem.querySelector(".action-select-group").addEventListener('click', function(e) {
		thisView.group.publish('group-selected');
		e.preventDefault();
	}, false);
	
	groupListItem.querySelector(".action-delete-group").addEventListener('click', function(e) {
		thisView.group.publish('group-deleted');
		thisView.element.remove();
		thisView.eventService.dispatch(thisView.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
		e.preventDefault();
	}, false);
	
	return groupListItem;
}