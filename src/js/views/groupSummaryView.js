'use strict';

function groupSummaryView(group, eventService) {
	
	this.group = group;
	this.eventService = eventService;
	this.groupSummaryContainer = document.querySelector(".group-summary");
	this.groupSummaryContainer.innerHTML = getViewTemplate();
	
	this.groupTitleContainer = this.groupSummaryContainer.querySelector(".group-title");

    var groupTotalContainer = this.groupSummaryContainer.querySelector(".group-total");
    this.groupTotalContainer = groupTotalContainer;

	this.editableTimeoutId = null;
	
	this.setTitle(this.group.title);
	this.setTotal(this.group.getTotal());
	
	this.onGroupTitleChanged(this);
	this.onGroupTitleChanging(this);

    group.subscribe('total-modified', updateTotal);

    function updateTotal(e) {
        var g = e.target;
        groupTotalContainer.textContent = g.getTotal();
    }

	function getViewTemplate() {
		return 	'<span class="group-title" contenteditable="true"></span>' + 
				'<span class="group-total paren-data"></span>';
	}
}

groupSummaryView.prototype.setTitle = function(title) {
	this.groupTitleContainer.textContent = this.group.title;
}

groupSummaryView.prototype.setTotal = function(total) {	
	this.groupTotalContainer.textContent = this.group.getTotal();
}

groupSummaryView.prototype.onGroupTitleChanging = function(view) {
	view.groupTitleContainer.addEventListener('input', function(e) {
		
		view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
		view.group.title = view.groupTitleContainer.textContent;
		e.preventDefault();
		
		window.clearTimeout(view.editableTimeoutId);
		view.editableTimeoutId = window.setTimeout(function() {
			view.onGroupTitleChanged(view);
		}, 1500);
	}, false);
}

groupSummaryView.prototype.onGroupTitleChanged = function(view) {
	view.group.publish('change-group-title', { 'groupId' : view.group.id });
}