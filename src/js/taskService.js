'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, taskHtmlFactory, eventService, timeService, win) {
	
	var activeGroup = null;
	var editableTimeoutId = 0;
	var taskContainer = win.document.querySelector("#taskContainer");
	
	function startTask(task) {
		task.isRunning = true;
		if (task.intervalId == null)
		{
			task.intervalId = win.setInterval(taskCounter, 1000, task);
		}
	}
	
	function stopTask(task) {
		task.isRunning = false;
		win.clearInterval(task.intervalId);
		task.intervalId = null;
	}
	
	function taskCounter(task) {
		task.runtime += 1;
		
		// move this to taskHtmlFactory as updateTaskTotal(task) ? not really a factory responsibility, though.
		var taskElement = getElementForTaskByTaskId(task.id);
		if (taskElement !== null) {
			taskElement.querySelector("span.total").textContent = task.total;
		}
		// end
		
		eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : { 'groupId' : task.groupId }});
	}
	
	function playPauseTask(task, taskElement) {
		
		var playIcon = taskElement.querySelector(".task-play-pause-icon");
		playIcon.classList.toggle("icon-play");
		playIcon.classList.toggle("icon-pause");
		
		var taskEventName = 'task-started';
		if (task.isRunning) taskEventName = 'task-stopped';
		
		taskElement.dispatchEvent(new CustomEvent(taskEventName, { 'detail' : task }));
		eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
	}
	
	// move this to taskHtmlFactory (as public)?
	function getElementForTaskByTaskId(taskId) {
		return taskContainer.querySelector("#" + taskId);
	}
	// end
	
	function createTaskElement(task) {
		
		var callbackConfig = {
			'playCallback' : function(e) {
				playPauseTask(task, getElementForTaskByTaskId(task.id));
				e.preventDefault();
			},
			'titleEditCallback' : function(e) {
				eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				task.name = e.currentTarget.textContent;
				e.preventDefault();
				
				win.clearTimeout(editableTimeoutId);
				editableTimeoutId = win.setTimeout(function() {
					eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
				}, 1500);			
			},
			'totalEditCallback' : function(e) {
				eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				task.runtime = timeService.getSecondsFromHourMinuteSecond(e.currentTarget.textContent);
				e.preventDefault();
				
				win.clearTimeout(editableTimeoutId);
				editableTimeoutId = win.setTimeout(function() {
					eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
					eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
				}, 1500);	
			},
			'deleteCallback' : function(e) {
				var taskIndex = activeGroup.tasks.indexOf(task);
				if (taskIndex > -1) {
					activeGroup.tasks.splice(taskIndex, 1);
				}
				var taskElement = getElementForTaskByTaskId(task.id);
				eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
				eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : task.groupId }});
				taskElement.remove();
				e.preventDefault();
			}
		};
		
		return taskHtmlFactory.makeTaskElement(task, callbackConfig);
	}
	
	function setActiveGroup(group) {
		activeGroup = group;
		if (activeGroup !== null) {
			makeTasksForGroup(group);
		}
	}
	
	function makeTask(task) {
		var taskElement = createTaskElement(task);
			
		taskElement.addEventListener('task-started', function(e) {
			startTask(e.detail);
		});
		taskElement.addEventListener('task-stopped', function(e) {
			stopTask(e.detail);
		});
		taskContainer.appendChild(taskElement);
		
		if (task.isRunning) {
			startTask(task);
		}
	}
	
	function makeTasksForGroup(group) {
		taskContainer.textContent = ""; // move this "clear" responsiblity to taskHtmlFactory?? 
		for(var i = 0, len = group.tasks.length; i < len; i++) {
			var tempTask = group.tasks[i];
			var task = taskFactory.createTask(tempTask);
			makeTask(task);
		}
	}
	
	function addNewTaskToActiveGroup() {
		var task = taskFactory.createNewTask(activeGroup);
		activeGroup.tasks.push(task);
		eventService.dispatch(eventService.events.task.added, { 'detail' : { 'task' : task , 'taskId' : task.id }});
		eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : { 'group' : activeGroup, 'groupId' : activeGroup.id } });
	}
	
	function bindNewTaskAction() {
		var els = win.document.querySelectorAll(".action-task-add");
		for (var i = 0, len = els.length; i < len; i++) {
			els[i].addEventListener('click', function(e) {
				addNewTaskToActiveGroup();
				e.preventDefault();
			}, false);
		}
	}
	
	function groupSelectedEventHandler(e) {
		setActiveGroup(e.detail.group);
		e.preventDefault();
	}
	
	function taskAddedEventHandler(e) {
		makeTask(e.detail.task);
		e.preventDefault();
	}
	
	function bind() {		
		eventService.subscribe(eventService.events.task.added, taskAddedEventHandler);
		eventService.subscribe(eventService.events.group.selected, groupSelectedEventHandler);
		bindNewTaskAction();
	}
	
	function init() {
		bind();
	}
	
	init();
	
})(logger, tt.taskFactory, tt.taskHtmlFactory, tt.eventService, tt.timeService, this);