'use strict';

var tt = tt || {};
tt.taskFactory = (function(logger) {

	function makeId() {
		var min = 1000;
		var max = 9999;
		return "task-" + Math.floor(new Date().getTime() / 1000) + "-" + 
			Math.floor(Math.random() * (max - min) + min);
	}
	
	function makeDefaultTaskData(group) {
		return {
			id : makeId(),
			groupId : group.id,
			title : 'new task',
			runtime : 0.00,
			isComplete : false,
			isRunning : false,
			intervalId : null
		};
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
		var taskObj = new Task();
        Object.seal(taskObj);
		return taskObj;
	}
	
	function createNewTask(group) {
        logger.logDebug('created new task object');
		var task = makeObject();
		var data = makeDefaultTaskData(group);
		task = setData(task, data);
		return task;
	}
	
	function createTask(data) {
        logger.logDebug('created task object from data');
		var task = makeObject();
		task = setData(task, data);
		return task;
	}
	
	return {
        "createTask": createTask,
        "createNewTask": createNewTask
	};

})(logger);