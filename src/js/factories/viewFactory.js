'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger, eventService) {

	function makeGroupsNavigationView(groups) {
		return new groupsNavigationView(groups, eventService);
	}
	
	function makeTaskView(task) {
		return new taskView(task);
	}
	
	function makeGroupSummaryView(group) {
		return new groupSummaryView(group);
	}
	
	return { 
		makeGroupsNavigationView,
		makeTaskView,
		makeGroupSummaryView
	};
	
})(logger, tt.eventService);