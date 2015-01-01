'use strict';

var tt = tt || {};
tt.taskFactory = (function(logger) {

	function createNewTask() {
		return { 
			name : 'new task',
			total : 0.00,
			isComplete : false,
			isRunning : false,
			timerObject : null
		};
	}
	
	return { 
		createNewTask : createNewTask 
	};

})(logger);