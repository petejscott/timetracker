'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, ui, win) {
	
	var activeGroup = null;
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
		getElementForTaskByTaskId(task.id).dispatchEvent(new Event('task-time-changed'));
	}
	
	function playPauseTask(task, taskElement) {
		
		var playIcon = taskElement.querySelector(".task-play-pause-icon");
		playIcon.classList.toggle("icon-play");
		playIcon.classList.toggle("icon-pause");
		
		var taskEventName = 'task-started';
		if (task.isRunning) taskEventName = 'task-stopped';
		
		taskElement.dispatchEvent(new CustomEvent(taskEventName, { 'detail' : task }));
		taskElement.dispatchEvent(new Event('task-changed'));
	}
	
	function getElementForTaskByTaskId(taskId) {
		return taskContainer.querySelector("#" + taskId);
	}
	
	function makeCompleteElement(task) {
		var complete = win.document.createElement("span");
		complete.setAttribute("class", "complete");
		var completeAnchor = win.document.createElement("a");
		completeAnchor.setAttribute("href", "#complete");
		completeAnchor.setAttribute("title", "Mark Complete");
		var completeIcon = win.document.createElement("i");
		completeIcon.setAttribute("class", "icon-ok-circled2");
		completeAnchor.appendChild(completeIcon);
		complete.appendChild(completeAnchor);
		return complete;
	}
	
	function makeTitleElement(task) {
		var title = win.document.createElement("span");
		title.setAttribute("class", "title");
		title.setAttribute("contentEditable", true);
		title.setAttribute("title", "Click and type to change, then press enter to save.");
		title.appendChild(win.document.createTextNode(task.name));
		
		title.addEventListener('keypress', function(e) {
			if (e.keyCode === 13) {
				getElementForTaskByTaskId(task.id).dispatchEvent(new Event('task-changed'));
				e.preventDefault();
			}
		})
		title.addEventListener('input', function(e) {
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-status', { 'detail' : 'not synced' }));
			task.name = title.textContent;
			e.preventDefault();
		}, false);
		
		return title;
	}
	
	function makeTotalElement(task) {
		var total = win.document.createElement("span");
		total.setAttribute("class", "total");
		total.appendChild(win.document.createTextNode(task.total));
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
		listItem.appendChild(makeCompleteElement(task));
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
		taskElement.addEventListener('task-time-changed', function(e) {
			getElementForTaskByTaskId(task.id).dispatchEvent(new Event('task-changed'));
		});
		taskElement.addEventListener('task-changed', function(e) {			
			ui.mainContainer.dispatchEvent(new CustomEvent('group-changed', { 'detail' : activeGroup }));
			ui.mainContainer.dispatchEvent(new CustomEvent('sync-requested', { 'detail' : activeGroup }));
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
		ui.mainContainer.dispatchEvent(new CustomEvent('group-changed', { 'detail' : activeGroup }));
	}
	
	function setGroupSummary(group) {
		var nameElement = win.document.querySelector("h2 span.group-name");
		nameElement.textContent = group.name;
		var totalElement = win.document.querySelector("h2 span.group-total");
		totalElement.textContent = group.total;
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
			setGroupSummary(e.detail);
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
	
})(logger, tt.taskFactory, tt.ui, this);