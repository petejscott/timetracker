'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, viewFactory, eventService, win) {
		
	function groupSelectedEventHandler(e) {
		var activeGroup = e.detail.group;
		if (activeGroup !== null) {
			var view = viewFactory.makeTaskListView(activeGroup, taskFactory);
		}
		e.preventDefault();
	}
	
	eventService.subscribe(eventService.events.group.selected, groupSelectedEventHandler);
	
})(logger, tt.taskFactory, tt.viewFactory, tt.eventService, this);