'use strict';

var tt = tt || {};
tt.groupFactory = (function(logger, taskFactory, timeService) {

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
	
	function makeDefaultGroupData(title) {
		var data = {
			id: makeId(),
			title: getCurrentWeekName(),
			tasks: []
		};
		return data;
	}
	
	function setData(group, data) {
		group.id = data.id;
		if (typeof(data.title) === 'undefined') data.title = data.name;
		group.title = data.title;
		group.tasks = data.tasks;
		return group;
	}
	
	function makeObject() {
		function group() {
			observableObject.call(this);
		}
		group.prototype = Object.create(observableObject.prototype);
		group.prototype.constructor = group;
		
		group.prototype.addTask = function(task) {
			this.tasks.push(task);
		}
		
		var groupObj = new group();
		
		if (typeof(groupObj.total) === 'undefined')
		{
			Object.defineProperty(groupObj, 'total', {
				get : function() {
					var total = 0.00;
					for (var i = 0, len = groupObj.tasks.length; i < len; i++) {
						total += groupObj.tasks[i].runtime;
					}
					return timeService.formatSecondsAsHourMinuteSecond(total);
				}
			});
		}
		return groupObj;
	}
	
	function createTasks(group) {
		var taskCollection = group.tasks;
        group.tasks = [];
		for (var i = 0, len = taskCollection.length; i < len; i++) {
			var task = taskFactory.createTask(taskCollection[i]);
			group.addTask(task);
		}
		return group;
	}
	
	function createNewGroup() {		
		var group = makeObject();
		var data = makeDefaultGroupData();
		group = setData(group, data);
		group = createTasks(group);
		return group;
	}
	
	function createGroup(data) {
		var group = makeObject();
		group = setData(group, data);
        group = createTasks(group);
		return group;
	}
	
	return { 
		createNewGroup,
		createGroup
	};
	
})(logger, tt.taskFactory, tt.timeService);