'use strict';

function groupSummaryView(group, eventService) {
	
	this.group = group;
	this.eventService = eventService;
	this.groupSummaryContainer = document.querySelector(".group-summary");
	this.groupSummaryContainer.innerHTML = getViewTemplate();
	
	this.groupTitleContainer = this.groupSummaryContainer.querySelector(".group-title");
	this.groupTotalContainer = this.groupSummaryContainer.querySelector(".group-total");
	this.editableTimeoutId = null;
	
	this.setTitle(this.group.title);
	this.setTotal(this.group.total);
	
	this.onGroupTitleChanged(this);
	this.onGroupTitleChanging(this);
	this.onGroupTotalChangedEvent(this);
	
	function getViewTemplate() {
		return 	'<span class="group-title" contenteditable="true"></span>' + 
				'<span class="group-total paren-data"></span>';
	}
}

groupSummaryView.prototype.setTitle = function(title) {
	this.groupTitleContainer.textContent = this.group.title;
}

groupSummaryView.prototype.setTotal = function(total) {	
	this.groupTotalContainer.textContent = this.group.total;
}

groupSummaryView.prototype.onGroupTitleChanging = function(view) {
	view.groupTitleContainer.addEventListener('input', function(e) {
		
		view.group.title = view.groupTitleContainer.textContent;
		e.preventDefault();
		
		window.clearTimeout(view.editableTimeoutId);
		view.editableTimeoutId = window.setTimeout(function() {
			view.onGroupTitleChanged(view);
		}, 1500);
	}, false);
}

groupSummaryView.prototype.onGroupTitleChanged = function(view) {
	view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
	view.group.publish('group-title-changed', { 'groupId' : view.group.id });
}

groupSummaryView.prototype.onGroupTotalChangedEvent = function(view) {
	view.group.subscribe('group-total-changed', function(e) {
		view.setTotal(group.total);
	});
}