'use strict';

var tt = tt || {};
tt.taskGroupFactory = (function(logger) {

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
	
	function createNewTaskGroup(name) {
		if (typeof(name) === 'undefined') {
			name = getCurrentWeekName();
		}
		var group = {
			id: makeId(),
			name: name,
			tasks: []
		};
		return createTaskGroup(group);
	}
	
	function createTaskGroup(data) {
		var taskGroup = { 
			id : data.id,
			name : data.name,
			tasks : data.tasks 
		};
		Object.defineProperty(taskGroup, 'total', {
			get : function() {
				var total = 0.00;
				for (var i = 0, len = taskGroup.tasks.length; i < len; i++) {
					total += taskGroup.tasks[i].runtime;
				}
				//TODO: extract to dateHelper object (also in taskFactory)
				var h = parseInt( total / 3600 ) % 24;
				var m = parseInt( total / 60 ) % 60;
				var s = total % 60;
				var result = 
					(h < 10 ? "0" + h : h) + ":" + 
					(m < 10 ? "0" + m : m) + ":" + 
					(s < 10 ? "0" + s : s);
				return result;
			}
		});
		return taskGroup;
	}
	
	return { 
		createNewTaskGroup : createNewTaskGroup,
		createTaskGroup : createTaskGroup
	};
	
})(logger);