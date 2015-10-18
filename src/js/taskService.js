'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, ui, timeService, win) {
	
	var activeGroup = null;
	var editableTimeoutId = 0;
	var taskContainer = win.document.querySelector("#taskContainer");
	
	function makePlayElement(task) {
		var play = win.document.createElement("span");
		play.setAttribute("class", "play-pause");
		
		var playAnchor = win.document.createElement("a");
		playAnchor.setAttribute("href", "#play");
		playAnchor.setAttribute("title", "Start Timer");
		
		var playIcon = win.document.createElement("i");
		var playIconClass = "icon-play";
		if (task.isRunning) playIconClass = "icon-pause";
		playIcon.setAttribute("class", "task-play-pause-icon " + playIconClass);
		
		playAnchor.appendChild(playIcon);
		play.appendChild(playAnchor);
		
		return play;
	}
	
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
	
	function makeDeleteElement(task) {
		var del = win.document.createElement("span");
		del.setAttribute("class", "delete");
		var delAnchor = win.document.createElement("a");
		delAnchor.setAttribute("href", "#delete");
		delAnchor.setAttribute("title", "Delete Task");
		var delIcon = win.document.createElement("i");
		delIcon.setAttribute("class", "icon-cancel-circled");
		delAnchor.appendChild(delIcon);
		del.appendChild(delAnchor);
		
		del.addEventListener('click', function(e) {
			var taskIndex = activeGroup.tasks.indexOf(task);
			if (taskIndex > -1) {
				activeGroup.tasks.splice(taskIndex, 1);
			}
			var taskElement = getElementForTaskByTaskId(task.id);
			ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
			taskElement.remove();
			e.preventDefault();
		});
		
		return del;
	}
	
	function makeTitleElement(task) {
		var title = win.document.createElement("span");
		title.setAttribute("class", "title");
		title.setAttribute("contentEditable", true);
		title.appendChild(win.document.createTextNode(task.name));
		
		title.addEventListener('input', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			task.name = title.textContent;
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
			}, 1500);			
		}, false);
		
		return title;
	}
	
	function makeTotalElement(task) {
		var total = win.document.createElement("span");
		total.setAttribute("class", "total");
		total.setAttribute("contentEditable", "true");
		total.appendChild(win.document.createTextNode(task.total));
		
		total.addEventListener('input', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			task.runtime = timeService.getSecondsFromHourMinuteSecond(total.textContent);
			e.preventDefault();
			
			win.clearTimeout(editableTimeoutId);
			editableTimeoutId = win.setTimeout(function() {
				ui.mainContainer.dispatchEvent(new Event('group-collection-changed'));
			}, 1500);	
		}, false);
		
		return total;
	}
	
	function createTaskElement(task) {
		var listItem = win.document.createElement("li");
		listItem.setAttribute("id", task.id);
		
		var playElement = makePlayElement(task);
		playElement.addEventListener('click', function(e) {
			playPauseTask(task, listItem);
			e.preventDefault();
		});
		listItem.appendChild(playElement);
		
		listItem.appendChild(makeTitleElement(task));
		listItem.appendChild(makeTotalElement(task));
		listItem.appendChild(makeDeleteElement(task));
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
	
})(logger, tt.taskFactory, tt.ui, tt.timeService, this);