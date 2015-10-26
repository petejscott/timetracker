'use strict';

var tt = tt || {};
tt.taskFactory = (function(logger, timeService) {

	function makeId() {
		var min = 1000;
		var max = 9999;
		return "task-" + Math.floor(new Date().getTime() / 1000) + "-" + 
			Math.floor(Math.random() * (max - min) + min);
	}
	
	function makeDefaultTaskData(group) {
		var data = {
			id : makeId(),
			groupId : group.id,
			title : 'new task',
			runtime : 0.00,
			isComplete : false,
			isRunning : false,
			intervalId : null
		};
		return data;
	}
	
	function setData(task, data) {
		task.id = data.id;
		task.groupId = data.groupId;
		
		if (typeof(data.title) === 'undefined') data.title = data.name;
		task.title = data.title;
		
		task.setRuntime(data.runtime);
		task.isComplete = data.isComplete;
		task.isRunning = data.isRunning;
		task.intervalId = data.intervalId;
		return task;
	}
	
	function makeObject() {
		var taskObj = new task();
        Object.seal(taskObj);
		return taskObj;
	}
	
	function createNewTask(group) {		
		var task = makeObject();
		var data = makeDefaultTaskData(group);
		task = setData(task, data);
		return task;
	}
	
	function createTask(data) {
		var task = makeObject();
		task = setData(task, data);
		return task;
	}
	
	return { 
		createTask,
		createNewTask 
	};

})(logger, tt.timeService);