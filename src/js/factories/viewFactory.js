'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger, eventService, timeService) {

	function makeNavigationView(appData, groupFactory, taskFactory) {
		return new NavigationView(logger, appData, eventService, groupFactory, taskFactory, this);
	}
	
	function makeGroupNavigationView(group) {
		return new GroupNavigationView(group, eventService);
	}
	
	function makeTaskListView(group, taskFactory) {
		return new TaskListView(group, eventService, taskFactory, this);
	}
	
	function makeTaskView(task) {
		return new TaskView(task, eventService, timeService);
	}
	
	function makeSyncStatusView(clickEventHandler) {
		return new SyncStatusView(logger, eventService, clickEventHandler);
	}
	
	function makeGroupSummaryView(group) {
		return new GroupSummaryView(group, eventService);
	}
	
	return { 
		"makeNavigationView" : makeNavigationView,
		"makeGroupNavigationView" : makeGroupNavigationView,
		"makeTaskListView" : makeTaskListView,
		"makeTaskView" : makeTaskView,
		"makeSyncStatusView" : makeSyncStatusView,
		"makeGroupSummaryView" : makeGroupSummaryView
	};
	
})(logger, tt.eventService, tt.timeService);