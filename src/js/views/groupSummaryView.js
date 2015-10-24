'use strict';

function groupSummaryView(group) {
	
	this.group = group;
	this.groupSummaryContainer = document.querySelector(".group-summary");
	this.groupTitleContainer = this.groupSummaryContainer.querySelector(".group-title");
	this.groupTotalContainer = this.groupSummaryContainer.querySelector(".group-total");
	this.editableTimeoutId = null;
	
	
	this.bind();
	this.set();
}

groupSummaryView.prototype.bind = function() {
	var thisView = this;
		
	thisView.groupTitleContainer.addEventListener('input', function(e) {
		
		thisView.group.title = thisView.groupTitleContainer.textContent;
		e.preventDefault();
		
		window.clearTimeout(thisView.editableTimeoutId);
		thisView.editableTimeoutId = window.setTimeout(function() {
			thisView.group.publish('group-title-changed', { 'groupId' : thisView.group.id });
		}, 1500);
		
	}, false);
	
	this.group.subscribe('group-total-changed', function(e) {
		thisView.groupTotalContainer.textContent = group.total;
	});
}
groupSummaryView.prototype.set = function() {
	this.groupTitleContainer.textContent = this.group.title;
	this.groupTotalContainer.textContent = this.group.total;
}