'use strict';

function TaskView(task, eventService, timeService) {

    var editableTimeoutId = 0;
	var element = makeTaskElement(getViewTemplate());
    this.element = element;

    task.subscribe('task-removed', removeTask);
    task.subscribe('on-task-state-toggle', taskStateToggled);
    task.subscribe('on-task-state-toggle', setTaskStateIcon);

    if (task.isRunning)
    {
        stopTask();
        startTask();
        setTaskStateIcon();
    }

    function taskStateToggled() {
        if (task.isRunning) {
            stopTask();
        } else {
            startTask();
        }

        task.publish('task-state-toggled');
    }

    function setTaskStateIcon() {
        var playIcon = element.querySelector(".task-play-pause-icon");
        playIcon.classList.remove("icon-play");
        playIcon.classList.remove("icon-pause");

        if (task.isRunning) {
            playIcon.classList.add("icon-pause");
        } else {
            playIcon.classList.add("icon-play");
        }
    }

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
		
		listItem.innerHTML = template;
		
		listItem.querySelector('.total').textContent = task.getTotal();

		listItem.querySelector('.play-pause').addEventListener('click', function(e) {
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            task.publish('on-task-state-toggle');
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
		
		var totalEditor = listItem.querySelector('.total');
		totalEditor.addEventListener('input', function(e) {
			
            var inputFormat = /^\d{2}:\d{2}:\d{2}$/;
            if (inputFormat.test(e.currentTarget.textContent)) {
                e.currentTarget.classList.remove('invalid-input');
            } else {
                e.currentTarget.classList.add('invalid-input');
                return;
            }

            var tempRuntime = timeService.getSecondsFromHourMinuteSecond(e.currentTarget.textContent);
            if (tempRuntime === task.getRuntime()) {
                return;
            }

            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });

            window.clearInterval(editableTimeoutId);
            editableTimeoutId = window.setInterval(function() {
				if (!document.activeElement.classList.contains('total')) {
					window.clearInterval(editableTimeoutId);
					task.setRuntime(tempRuntime);
				}
            }, 1500);

        }, false);

        listItem.querySelector('.delete').addEventListener('click', function(e) {
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            task.setRuntime(0);
            task.publish('on-task-remove');
            e.preventDefault();
        }, false);

        return listItem;
	}

	function startTask() {
		task.isRunning = true;
		if (task.intervalId == null)
		{
			task.intervalId = window.setInterval(taskCounter, 1000, task);
		}
	}
	
	function stopTask() {
		task.isRunning = false;
		window.clearInterval(task.intervalId);
		task.intervalId = null;
	}
	
	function taskCounter(task) {
		task.setRuntime(task.getRuntime() + 1);
	}
}

TaskView.prototype.getElement = function() {
	return this.element;
};