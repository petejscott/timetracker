'use strict';

var tt = tt || {};
tt.taskFactory = (function(logger) {

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
					var h = parseInt( task.runtime / 3600 ) % 24;
					var m = parseInt( task.runtime / 60 ) % 60;
					var s = task.runtime % 60;
					var result = 
						(h < 10 ? "0" + h : h) + ":" + 
						(m < 10 ? "0" + m : m) + ":" + 
						(s < 10 ? "0" + s : s);
					return result;
				}
			});
		}
		return task;
	}
	
	return { 
		createTask : createTask,
		createNewTask : createNewTask 
	};

})(logger);