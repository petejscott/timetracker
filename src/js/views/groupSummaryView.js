'use strict';

function groupSummaryView(group) {
	
	this.group = group;
	this.groupSummaryContainer = document.querySelector(".group-summary");
	this.groupTitleContainer = this.groupSummaryContainer.querySelector(".group-title");
	this.groupTotalContainer = this.groupSummaryContainer.querySelector(".group-total");
	this.editableTimeoutId = null;
	
	this.setTitle(this.group.title);
	this.setTotal(this.group.total);
	
	this.onGroupTitleChanged(this);
	this.onGroupTitleChanging(this);
	this.onGroupTotalChangedEvent(this);
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
	view.group.publish('group-title-changed', { 'groupId' : view.group.id });
}

groupSummaryView.prototype.onGroupTotalChangedEvent = function(view) {
	view.group.subscribe('group-total-changed', function(e) {
		view.setTotal(group.total);
	});
}