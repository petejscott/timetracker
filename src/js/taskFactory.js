'use strict';

var tt = tt || {};
tt.taskFactory = (function(logger, timeService) {

	function makeId() {
		var min = 1000;
		var max = 9999;
		return "task-" + Math.floor(new Date().getTime() / 1000) + "-" + 
			Math.floor(Math.random() * (max - min) + min);
	}
	
	function createNewTask() {
		var data = {
			id : makeId(),
			name : 'new task',
			runtime : 0.00,
			isComplete : false,
			isRunning : false
		};
		return createTask(data);
	}
	
	function createTask(task) {
		task.timerObject = null;
		if (typeof(task.total) === 'undefined')
		{
			Object.defineProperty(task, 'total', {
				get : function() {
					return timeService.formatSecondsAsHourMinuteSecond(task.runtime);
				}
			});
		}
		return task;
	}
	
	return { 
		createTask,
		createNewTask 
	};

})(logger, tt.timeService);