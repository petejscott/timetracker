'use strict';

var tt = tt || {};
tt.taskHtmlFactory = (function(logger, win) {
	
	//Maybe taskHtmlFactory is really a combination of view/viewmodel?
	
	function makeTaskContainer(task) {
		var listItem = win.document.createElement("li");
		listItem.setAttribute("id", task.id);
		listItem.setAttribute("data-taskid", task.id);
		listItem.setAttribute("data-groupid", task.groupId);
		
		return listItem;
	}
	
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
	
	function makeTitleElement(task) {
		var title = win.document.createElement("span");
		title.setAttribute("class", "title");
		title.setAttribute("contentEditable", true);
		title.appendChild(win.document.createTextNode(task.name));
		
		return title;
	}
	
	function makeTotalElement(task) {
		var total = win.document.createElement("span");
		total.setAttribute("class", "total");
		total.setAttribute("contentEditable", "true");
		total.appendChild(win.document.createTextNode(task.total));
		
		return total;
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
		
		return del;
	}
	
	function makeTaskElement(task, callbackConfig) {
		var listItem = makeTaskContainer(task);
		var playElement = makePlayElement(task);
		var titleElement = makeTitleElement(task);
		var totalElement = makeTotalElement(task);
		var deleteElement = makeDeleteElement(task);
		
		playElement.addEventListener('click', callbackConfig.playCallback, false);		
		titleElement.addEventListener('input', callbackConfig.titleEditCallback, false);
		totalElement.addEventListener('input', callbackConfig.totalEditCallback, false);
		deleteElement.addEventListener('click', callbackConfig.deleteCallback, false);
		
		listItem.appendChild(playElement);
		listItem.appendChild(titleElement);
		listItem.appendChild(totalElement);
		listItem.appendChild(deleteElement);
			
		return listItem;
	}
	
	return {
		makeTaskElement
	}
	
})(logger, this);