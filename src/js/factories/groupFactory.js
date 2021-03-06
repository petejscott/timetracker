'use strict';

var tt = tt || {};
tt.groupFactory = (function(logger, taskFactory) {

	function getStartOfWeek(date) {
		var d = new Date(date);
		var day = d.getDay();
		var diff = d.getDate() - day;
		return new Date(d.setDate(diff));
	}
	
	function getEndOfWeek(date) {
		var d = getStartOfWeek(date);
		var diff = d.getTime() + 6*24*60*60*1000;
		return new Date(diff);
	}
	
	function getCurrentWeekName() {
		var currentDay = new Date();
		var currentWeekStartDate = getStartOfWeek(currentDay);
		var strStart = (currentWeekStartDate.getMonth() + 1) + "/" + currentWeekStartDate.getDate();
		var currentWeekEndDate = getEndOfWeek(currentDay);
		var strEnd = (currentWeekEndDate.getMonth() + 1) + "/" + currentWeekEndDate.getDate();
		return "Week of " + strStart + " - " + strEnd + "";
	}
	
	function makeId() {
		var min = 1000;
		var max = 9999;
		return "group-" + Math.floor(new Date().getTime() / 1000) + "-" + 
			Math.floor(Math.random() * (max - min) + min);
	}
	
	function makeDefaultGroupData() {
		return {
            id: makeId(),
            title: getCurrentWeekName(),
            tasks: []
        };
	}
	
	function setData(group, data) {
		group.id = data.id;
		if (typeof(data.title) === 'undefined') data.title = data.name;
		group.title = data.title;
		return group;
	}
	
	function makeObject() {
		var groupObj = new Group();
		Object.seal(groupObj);
		return groupObj;
	}
	
	function createTasks(group, taskCollection) {

		for (var i = 0, len = taskCollection.length; i < len; i++) {
			var task = taskFactory.createTask(taskCollection[i]);
			group.addTask(task);
		}
		return group;
	}
	
	function createNewGroup() {
        logger.logDebug('created new group object');
		var group = makeObject();
		var data = makeDefaultGroupData();
		group = setData(group, data);
		group = createTasks(group, data.tasks);
		return group;
	}
	
	function createGroup(data) {
        logger.logDebug('created group object from data');
		var group = makeObject();
		group = setData(group, data);
        group = createTasks(group, data.tasks);
		return group;
	}
	
	return { 
		"createNewGroup" : createNewGroup,
		"createGroup" : createGroup
	};
	
})(logger, tt.taskFactory);