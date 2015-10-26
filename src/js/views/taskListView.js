'use strict';

function taskListView(group, eventService, taskFactory, viewFactory) {
	
	var group = group;
	var eventService = eventService;
	var taskFactory = taskFactory;
	var viewFactory = viewFactory;
	
	var taskListContainer = document.querySelector(".tasks");
	this.element = makeTaskListElement(getViewTemplate());
	var tasksContainer = taskListContainer.querySelector(".tasklist");	
	makeTasks();

    for (var i = 0, len = group.tasks.length; i < len; i++) {
        var t = group.tasks[i];
        t.subscribe('delete-task', removeTaskFromCollection);
    }

    function removeTaskFromCollection(e) {
        group.removeTask(e.target);
    }
	
	function getViewTemplate() {
		return 	'<header>' +
					'<h2 class="icon-list-bullet">Tasks</h2>' +
					'<a href="#task-add" title="Add a task" class="action-task-add icon-plus-circled"></a>' +
				'</header>' + 
				'<ul id="taskContainer" class="tasklist"></ul>';
	}
	
	function addNewTaskToActiveGroup() {
		var task = taskFactory.createNewTask(group);
		group.addTask(task);
		tasksContainer.appendChild(makeTask(task));
	}
	
	function makeTask(task) {
		
		var view = viewFactory.makeTaskView(task);
		var taskElement = view.getElement();
        
		return taskElement;
	}
	
	function makeTaskListElement(template) {
		taskListContainer.innerHTML = template;
		taskListContainer.querySelector(".action-task-add").addEventListener("click", addNewTaskToActiveGroup);
	}
	
	function makeTasks() {	
		for(var i = 0, len = group.tasks.length; i < len; i++) {
			tasksContainer.appendChild(makeTask(group.tasks[i]));
		}
	}
}

taskListView.prototype.getElement = function() {
	return this.element;
}