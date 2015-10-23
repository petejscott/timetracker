'use strict';

var tt = tt || {};
tt.viewFactory = (function(logger) {

	function makeGroupsNavigationView(groups) {
		return new groupsNavigationView(groups);
	}
	
	function makeTaskView(task) {
		return new taskView(task);
	}
	
	return { 
		makeGroupsNavigationView,
		makeTaskView
	};
	
})(logger);