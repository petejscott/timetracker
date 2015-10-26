'use strict';

function taskView(task, eventService, timeService) {
	
	this.task = task;
	this.eventService = eventService;
	this.timeService = timeService;
	var element = makeTaskElement(getViewTemplate(), makeCallbackConfig(this));
    this.element = element;
	this.editableTimeoutId = 0;

    task.subscribe('task-removed', removeTask);

    function removeTask(e) {
        element.remove();
    }
	
	function getViewTemplate() {
		return 	'<span class="play-pause"><a title="Start Timer" href="#play"><i class="task-play-pause-icon icon-play"></i></a></span>' + 
				'<span spellcheck="false" class="title" contenteditable="true"></span>' + 
				'<span class="total" contenteditable="true"></span>' + 
				'<span class="delete"><a title="Delete Task" href="#delete"><i class="icon-cancel-circled"></i></a></span>';
	}
	
	function makeCallbackConfig(view) {
		var callbackConfig = {
			'playCallback' : function(e) {
				view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				playPauseTask(view.task, view.element);
				e.preventDefault();
			},
			'titleEditCallback' : function(e) {
				view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				view.task.title = e.currentTarget.textContent;
				e.preventDefault();
			},
			'totalEditCallback' : function(e) {
				view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				view.task.setRuntime(timeService.getSecondsFromHourMinuteSecond(e.currentTarget.textContent));
				e.preventDefault();
				
				//window.clearTimeout(view.editableTimeoutId);
				//view.editableTimeoutId = window.setTimeout(function() {
				//	view.task.publish('task-time-tick');
				//}, 1500);
			},
			'deleteCallback' : function(e) {
				view.eventService.dispatch(view.eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
				stopTask(task);
				task.setRuntime(0);
				view.task.publish('delete-task');
				//view.getElement().remove();
				e.preventDefault();
			}
		};
		return callbackConfig;
	}
	
	function makeTaskElement(template, callbackConfig) {
		var listItem = document.createElement("li");
		listItem.setAttribute("id", task.id);
		listItem.setAttribute("data-taskid", task.id);
		listItem.setAttribute("data-groupid", task.groupId);
		listItem.addEventListener('start-task', function(e) {
			startTask(e.detail);
		});
		listItem.addEventListener('stop-task', function(e) {
			stopTask(e.detail);
		});
		
		listItem.innerHTML = template;
		
		listItem.querySelector('.total').textContent = task.getTotal();
		
		listItem.querySelector('.play-pause').addEventListener('click', callbackConfig.playCallback, false);		
		
		listItem.querySelector('.title').textContent = task.title;	
		listItem.querySelector('.title').addEventListener('input', callbackConfig.titleEditCallback, false);
		
		listItem.querySelector('.total').textContent = task.getTotal();
		
		task.subscribe('total-modified', function(e) {
			listItem.querySelector('.total').textContent = task.getTotal();
		});
		
		listItem.querySelector('.total').addEventListener('input', callbackConfig.totalEditCallback, false);
		
		listItem.querySelector('.delete').addEventListener('click', callbackConfig.deleteCallback, false);
		
		if (task.isRunning) {
			startTask(task);
		}
		
		return listItem;
	}
	
	function startTask(task) {
		task.isRunning = true;
		if (task.intervalId == null)
		{
			task.intervalId = window.setInterval(taskCounter, 1000, task);
		}
	}
	
	function stopTask(task) {
		task.isRunning = false;
		window.clearInterval(task.intervalId);
		task.intervalId = null;
	}
	
	function taskCounter(task) {
		task.setRuntime(task.getRuntime() + 1);
	}
	
	//TODO: event triggering seems quirky here.
	function playPauseTask(task, taskElement) {
		
		var playIcon = taskElement.querySelector(".task-play-pause-icon");
		playIcon.classList.toggle("icon-play");
		playIcon.classList.toggle("icon-pause");
		
		var taskEventName = 'start-task';
		if (task.isRunning) taskEventName = 'stop-task';
		
		taskElement.dispatchEvent(new CustomEvent(taskEventName, { 'detail' : task }));
	}
}

taskView.prototype.getElement = function() {
	return this.element;
}