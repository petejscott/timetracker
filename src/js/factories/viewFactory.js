'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger, eventService) {

	function makeGroupsNavigationView(groups) {
		return new groupsNavigationView(groups, eventService);
	}
	
	function makeTaskView(task) {
		return new taskView(task);
	}
	
	return { 
		makeGroupsNavigationView,
		makeTaskView
	};
	
})(logger, tt.eventService);