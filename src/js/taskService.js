'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, taskHtmlFactory, ui, timeService, win) {
	
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
		ui.mainContainer.dispatchEvent(new CustomEvent('group-time-changed', { 'detail' : activeGroup }));
	}
	
	function playPauseTask(task, taskElement) {
		
		var playIcon = taskElement.querySelector(".task-play-pause-icon");
		playIcon.classList.toggle("icon-play");
		playIcon.classList.toggle("icon-pause");
		
		var taskEventName = 'task-started';
		if (task.isRunning) taskEventName = 'task-stopped';
		
		taskElement.dispatchEvent(new CustomEvent(taskEventName, { 'detail' : task }));
		ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
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
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			task.name = titleElement.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
			}, 1500);			
		}, false);
		
		totalElement.addEventListener('input', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			task.runtime = timeService.getSecondsFromHourMinuteSecond(totalElement.textContent);
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
				ui.mainContainer.dispatchEvent(new CustomEvent('group-time-changed', { 'detail' : activeGroup }));
			}, 1500);	
		}, false);
		
		deleteElement.addEventListener('click', function(e) {
			var taskIndex = activeGroup.tasks.indexOf(task);
			if (taskIndex > -1) {
				activeGroup.tasks.splice(taskIndex, 1);
			}
			var taskElement = getElementForTaskByTaskId(task.id);
			ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
			ui.mainContainer.dispatchEvent(new CustomEvent('group-time-changed', { 'detail' : activeGroup }));
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
		taskContainer.dispatchEvent(new CustomEvent('task-added', { 'detail' : task }));
		ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
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
	
	function bindGroupSelectedEventListener() {
		ui.mainContainer.addEventListener('group-selected', function(e) {
			setActiveGroup(e.detail);
			e.preventDefault();
		}, false);
	}
	
	function bindTaskAddedEventListener() {
		taskContainer.addEventListener('task-added', function(e) {
			makeTask(e.detail);
			e.preventDefault();
		}, false);
	}
	
	function bind() {
		bindTaskAddedEventListener();
		bindGroupSelectedEventListener();
		bindNewTaskAction();
	}
	
	function init() {
		bind();
	}
	
	init();
	
})(logger, tt.taskFactory, tt.taskHtmlFactory, tt.ui, tt.timeService, this);