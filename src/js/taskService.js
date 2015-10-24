'use strict';

var tt = tt || {};
tt.taskService = (function(logger, taskFactory, viewFactory, eventService, win) {
	
	var activeGroup = null;
	var taskContainer = win.document.querySelector("#taskContainer");
	
	
	function makeTasksForActiveGroup() {
		taskContainer.textContent = ""; 
		for(var i = 0, len = activeGroup.tasks.length; i < len; i++) {
			makeTask(activeGroup.tasks[i]);
		}
	}
	
	function makeTask(task) {
		
		var view = viewFactory.makeTaskView(task);
		var taskElement = view.getElement();
		
		task.subscribe('task-deleted', function(e) {
			var t = e.detail.task;
			var taskIndex = -1;
			for (var i = 0, len = activeGroup.tasks.length; i < len; i++) {
				if (t.id === activeGroup.tasks[i].id) {
					taskIndex = i;
				}
			}
			if (taskIndex > -1) {
				activeGroup.tasks.splice(taskIndex, 1);
			}
		});
		
		taskContainer.appendChild(taskElement);
		
	}
	
	function addNewTaskToActiveGroup() {
		var task = taskFactory.createNewTask(activeGroup);
		activeGroup.tasks.push(task);
		activeGroup.publish('group-task-added', { 'task' : task });
		makeTask(task);
	}
	
	function bindNewTaskAction() {
		var els = win.document.querySelectorAll(".action-task-add");
		for (var i = 0, len = els.length; i < len; i++) {
			els[i].addEventListener('click', function(e) {
				addNewTaskToActiveGroup();
				eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				e.preventDefault();
			}, false);
		}
	}
	
	function groupSelectedEventHandler(e) {
		activeGroup = e.detail.group;
		if (activeGroup !== null) {
			makeTasksForActiveGroup();
		}
		e.preventDefault();
	}
	
	function bind() {		
		eventService.subscribe(eventService.events.group.selected, groupSelectedEventHandler);
		bindNewTaskAction();
	}
	
	function init() {
		bind();
	}
	
	init();
	
})(logger, tt.taskFactory, tt.viewFactory, tt.eventService, this);