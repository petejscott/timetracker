'use strict';

var tt = tt || {};
tt.eventService = (function(logger, config) {
	
	var eventElement = config.getEventElement();
    if (eventElement == null) {
        logger.logWarning("Missing config.eventElement in eventService; using new div");
        eventElement = document.createElement("div");
    }
	
	var events = {
		
		sync : {		
			statusUpdated: 		'sync-status-updated',
			requested: 			'sync-requested',
			removeGroups: 		'sync-remove-groups',
			getGroups: 			'sync-get-groups',
			groupsRetrieved: 	'sync-groups-retrieved'
			
		},
		task : {
			added: 				'task-added'
		},
		group : {
			added: 				'group-added'
		}
		
	};
	
	function dispatch(eventType, data) {
		if (typeof(data) === 'undefined') {
			eventElement.dispatchEvent(new Event(eventType));
		}
		else {
			eventElement.dispatchEvent(new CustomEvent(eventType, data));
		}
	}
	
	function subscribe(eventType, callback) {
		eventElement.addEventListener(eventType, callback, false);
	}
	
	return {
        "events" : events,
		"dispatch" : dispatch,
		"subscribe" : subscribe
	};
	
})(logger, tt.config);