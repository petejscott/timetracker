'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, taskHtmlFactory, ui, eventService, timeService, win) {
	
	var activeGroup = null;
	var editableTimeoutId = 0;
	var taskContainer = win.document.querySelector("#taskContainer");
	
	function startTask(task) {
		task.isRunning = true;
		task.timerObject = win.setInterval(taskCounter, 1000, task);
	}
	
	function stopTask(task) {
		task.isRunning = false;
		win.clearInterval(task.timerObject);
		task.timerObject = null;
	}
	
	function taskCounter(task) {
		task.runtime += 1;
		var taskElement = getElementForTaskByTaskId(task.id);
		taskElement.querySelector("span.total").textContent = task.total;
		eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : activeGroup });
	}
	
	function playPauseTask(task, taskElement) {
		
		var playIcon = taskElement.querySelector(".task-play-pause-icon");
		playIcon.classList.toggle("icon-play");
		playIcon.classList.toggle("icon-pause");
		
		var taskEventName = 'task-started';
		if (task.isRunning) taskEventName = 'task-stopped';
		
		taskElement.dispatchEvent(new CustomEvent(taskEventName, { 'detail' : task }));
		eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : activeGroup });
	}
	
	function getElementForTaskByTaskId(taskId) {
		return taskContainer.querySelector("#" + taskId);
	}
	
	function createTaskElement(task) {
		
		var listItem = taskHtmlFactory.makeTaskContainer(task);
		var playElement = taskHtmlFactory.makePlayElement(task);
		var titleElement = taskHtmlFactory.makeTitleElement(task);
		var totalElement = taskHtmlFactory.makeTotalElement(task);
		var deleteElement = taskHtmlFactory.makeDeleteElement(task);
		
		playElement.addEventListener('click', function(e) {
			playPauseTask(task, listItem);
			e.preventDefault();
		});
		
		titleElement.addEventListener('input', function(e) {
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			task.name = titleElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
			eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : activeGroup });
			}, 1500);			
		}, false);
		
		totalElement.addEventListener('input', function(e) {
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			task.runtime = timeService.getSecondsFromHourMinuteSecond(totalElement.textContent);
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
			eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : activeGroup });
			eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : activeGroup });
			}, 1500);	
		}, false);
		
		deleteElement.addEventListener('click', function(e) {
			var taskIndex = activeGroup.tasks.indexOf(task);
			if (taskIndex > -1) {
				activeGroup.tasks.splice(taskIndex, 1);
			}
			var taskElement = getElementForTaskByTaskId(task.id);
			eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : activeGroup });
			eventService.dispatch(eventService.events.group.timeChanged, { 'detail' : activeGroup });
			taskElement.remove();
			e.preventDefault();
		});
		
		listItem.appendChild(playElement);
		listItem.appendChild(titleElement);
		listItem.appendChild(totalElement);
		listItem.appendChild(deleteElement);
			
		return listItem;
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
		
		if (task.isRunning) startTask(task);
	}
	
	function makeTasksForGroup(group) {
		ui.clearElement(taskContainer);
		for(var i = 0, len = group.tasks.length; i < len; i++) {
			var task = taskFactory.createTask(group.tasks[i]);
			makeTask(task);
		}
	}
	
	function addNewTaskToActiveGroup() {
		var task = taskFactory.createNewTask();
		activeGroup.tasks.push(task);
		eventService.dispatch(eventService.events.task.added, { 'detail' : task });
		eventService.dispatch(eventService.events.group.collectionChanged, { 'detail' : activeGroup });
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
		setActiveGroup(e.detail);
		e.preventDefault();
	}
	
	function taskAddedEventHandler(e) {
		makeTask(e.detail);
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
	
})(logger, tt.taskFactory, tt.taskHtmlFactory, tt.ui, tt.eventService, tt.timeService, this);