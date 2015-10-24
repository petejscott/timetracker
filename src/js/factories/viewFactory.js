'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger, eventService, timeService) {

	function makeGroupsNavigationView(groups) {
		return new groupsNavigationView(groups, eventService, this);
	}
	
	function makeGroupNavigationView(group) {
		return new groupNavigationView(group, eventService);
	}
	
	function makeTaskView(task) {
		return new taskView(task, eventService, timeService);
	}
	
	function makeGroupSummaryView(group) {
		return new groupSummaryView(group);
	}
	
	return { 
		makeGroupsNavigationView,
		makeGroupNavigationView,
		makeTaskView,
		makeGroupSummaryView
	};
	
})(logger, tt.eventService, tt.timeService);