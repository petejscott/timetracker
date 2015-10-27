'use strict';

function TaskListView(group, eventService, taskFactory, viewFactory) {

	var taskListContainer = document.querySelector(".tasks");
	this.element = makeTaskListElement(getViewTemplate());
    var tasksContainer = taskListContainer.querySelector(".tasklist");

	makeTasks();

    for (var i = 0, len = group.tasks.length; i < len; i++) {
        var t = group.tasks[i];
        t.subscribe('on-task-remove', removeTaskFromCollection);
    }
    group.subscribe('task-added', function(e) {
        var t = e.detail.task;
        console.log(e);
        t.subscribe('on-task-remove', removeTaskFromCollection);
    });

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
	
	function addNewTaskToActiveGroup(e) {
		var task = taskFactory.createNewTask(group);
		group.addTask(task);
		tasksContainer.appendChild(makeTask(task));
        e.preventDefault();
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

TaskListView.prototype.getElement = function() {
	return this.element;
};