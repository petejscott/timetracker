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
	
	function makeSyncStatusView(clickEventHandler) {
		return new syncStatusView(eventService, clickEventHandler);
	}
	
	function makeGroupSummaryView(group) {
		return new groupSummaryView(group, eventService);
	}
	
	return { 
		makeGroupsNavigationView,
		makeGroupNavigationView,
		makeTaskView,
		makeSyncStatusView,
		makeGroupSummaryView
	};
	
})(logger, tt.eventService, tt.timeService);