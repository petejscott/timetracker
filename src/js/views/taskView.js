'use strict';

function TaskView(task, eventService, timeService) {

    var editableTimeoutId = 0;
	var element = makeTaskElement(getViewTemplate());
    this.element = element;

    task.subscribe('task-removed', removeTask);

    function removeTask() {
        element.remove();
    }
	
	function getViewTemplate() {
		return 	'<span class="play-pause"><a title="Start Timer" href="#play"><i class="task-play-pause-icon icon-play"></i></a></span>' + 
				'<span spellcheck="false" class="title" contenteditable="true"></span>' + 
				'<span class="total" contenteditable="true"></span>' + 
				'<span class="delete"><a title="Delete Task" href="#delete"><i class="icon-cancel-circled"></i></a></span>';
	}

	function makeTaskElement(template) {
		var listItem = document.createElement("li");
		listItem.setAttribute("id", task.id);
		listItem.setAttribute("data-taskid", task.id);
		listItem.setAttribute("data-groupid", task.groupId);

        //TODO seriously this start/stop business is inane.
		listItem.addEventListener('start-task', function(e) {
			startTask(e.detail);
		});
		listItem.addEventListener('stop-task', function(e) {
			stopTask(e.detail);
		});
		
		listItem.innerHTML = template;
		
		listItem.querySelector('.total').textContent = task.getTotal();

		listItem.querySelector('.play-pause').addEventListener('click', function(e) {
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            playPauseTask(task, element);
            e.preventDefault();
        }, false);
		
		listItem.querySelector('.title').textContent = task.title;
		listItem.querySelector('.title').addEventListener('input', function(e) {
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            task.title = e.currentTarget.textContent;
            e.preventDefault();
        }, false);
		
		listItem.querySelector('.total').textContent = task.getTotal();
		
		task.subscribe('total-modified', function() {
			listItem.querySelector('.total').textContent = task.getTotal();
		});
		
		listItem.querySelector('.total').addEventListener('input', function(e) {

            var tempRuntime;
            tempRuntime = timeService.getSecondsFromHourMinuteSecond(e.currentTarget.textContent);
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            e.preventDefault();

            window.clearTimeout(editableTimeoutId);
            editableTimeoutId = window.setTimeout(function() {
            	task.setRuntime(tempRuntime);
            }, 1500);
        }, false);

        listItem.querySelector('.delete').addEventListener('click', function(e) {
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            task.setRuntime(0);
            task.publish('on-task-remove');
            e.preventDefault();
        }, false);
		
		if (task.isRunning) {
			stopTask(task);
		}
		
		return listItem;
	}

    // TODO INANE!
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

TaskView.prototype.getElement = function() {
	return this.element;
};