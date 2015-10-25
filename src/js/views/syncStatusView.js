'use strict';

function syncStatusView(logger, eventService, clickEventHandler) {
	
	this.eventService = eventService;
	this.syncStatusContainer = document.querySelector(".sync-status");

    if (this.syncStatusContainer == null)
    {
        logger.logError("Missing syncStatusView.syncStatusContainer");
        return;
    }

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
    if (this.syncMessageContainer == null) return;
	this.syncMessageContainer.textContent = message;
}

syncStatusView.prototype.onSyncStatusChangedEvent = function(view) {
	view.eventService.subscribe(view.eventService.events.sync.statusUpdated, function(e) {
		view.syncMessageContainer.textContent = e.detail;
	});
}