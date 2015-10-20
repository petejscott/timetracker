'use strict';

var tt = tt || {};
tt.eventService = (function(logger, config) {
	
	var eventElement = config.eventElement;
	
	var events = {
		
		sync : {		
			statusUpdated : 	'status-updated',
			requested : 		'sync-requested'
		},
		task : {
			timeChanged : 		'task-time-changed',
			added : 			'task-added'
		},
		group : {
			timeChanged : 		'group-time-changed',
			collectionChanged : 'group-collection-changed',
			selected : 			'group-selected',
			added : 			'group-added',
			detailChanged : 	'group-detail-changed'
		}
		
	};
	
	function dispatch(eventType, data) {
		var e = new CustomEvent(eventType, data);
		eventElement.dispatchEvent(e);
	}
	
	function subscribe(eventType, callback) {
		eventElement.addEventListener(eventType, callback, false);
	}
	
	return {
		events,
		dispatch,
		subscribe
	};
	
})(logger, tt.config);