'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger, eventService, timeService) {

	function makeNavigationView(appDataInstance, groupFactory, taskFactory) {
		return new navigationView(logger, appDataInstance, eventService, groupFactory, taskFactory, this);
	}
	
	function makeGroupNavigationView(group) {
		return new groupNavigationView(group, eventService);
	}
	
	function makeTaskListView(group, taskFactory) {
		return new taskListView(group, eventService, taskFactory, this);
	}
	
	function makeTaskView(task) {
		return new taskView(task, eventService, timeService);
	}
	
	function makeSyncStatusView(clickEventHandler) {
		return new syncStatusView(logger, eventService, clickEventHandler);
	}
	
	function makeGroupSummaryView(group) {
		return new groupSummaryView(group, eventService);
	}
	
	return { 
		makeNavigationView,
		makeGroupNavigationView,
		makeTaskListView,
		makeTaskView,
		makeSyncStatusView,
		makeGroupSummaryView
	};
	
})(logger, tt.eventService, tt.timeService);