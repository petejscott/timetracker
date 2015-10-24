'use strict';

function syncStatusView(eventService, clickEventHandler) {
	
	this.eventService = eventService;
	this.syncStatusContainer = document.querySelector(".sync-status");
	this.syncStatusContainer.innerHTML = getViewTemplate();
	this.syncMessageContainer = document.querySelector(".status-message");
	
	this.setMessage('up-to-date');
	
	this.onSyncStatusChangedEvent(this);
	this.syncStatusContainer.addEventListener('click', clickEventHandler);
	
	function getViewTemplate() {
		return 	'<span class="icon-upload status-message"></span>';
	}
}

syncStatusView.prototype.setMessage = function(message) {
	this.syncMessageContainer.textContent = message;
}

syncStatusView.prototype.onSyncStatusChangedEvent = function(view) {
	view.eventService.subscribe(view.eventService.events.sync.statusUpdated, function(e) {
		view.syncMessageContainer.textContent = e.detail;
	});
}