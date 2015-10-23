'use strict';

function taskView(task) {
	this.task = task;	
}

taskView.prototype.makeTaskContainer = function() {
	var listItem = document.createElement("li");
	listItem.setAttribute("id", this.task.id);
	listItem.setAttribute("data-taskid", this.task.id);
	listItem.setAttribute("data-groupid", this.task.groupId);
	
	return listItem;
}

taskView.prototype.makePlayElement = function() {
	var play = document.createElement("span");
	play.setAttribute("class", "play-pause");
	
	var playAnchor = document.createElement("a");
	playAnchor.setAttribute("href", "#play");
	playAnchor.setAttribute("title", "Start Timer");
	
	var playIcon = document.createElement("i");
	var playIconClass = "icon-play";
	if (this.task.isRunning) playIconClass = "icon-pause";
	playIcon.setAttribute("class", "task-play-pause-icon " + playIconClass);
	
	playAnchor.appendChild(playIcon);
	play.appendChild(playAnchor);
	
	return play;
}

taskView.prototype.makeTitleElement = function() {
	var title = document.createElement("span");
	title.setAttribute("class", "title");
	title.setAttribute("contentEditable", true);
	title.setAttribute("spellcheck", false);
	title.appendChild(document.createTextNode(this.task.name));
	
	return title;
}

taskView.prototype.makeTotalElement = function() {
	var total = document.createElement("span");
	total.setAttribute("class", "total");
	total.setAttribute("contentEditable", "true");
	total.appendChild(document.createTextNode(this.task.total));
	
	return total;
}

taskView.prototype.makeDeleteElement = function() {
	var del = document.createElement("span");
	del.setAttribute("class", "delete");
	var delAnchor = document.createElement("a");
	delAnchor.setAttribute("href", "#delete");
	delAnchor.setAttribute("title", "Delete Task");
	var delIcon = document.createElement("i");
	delIcon.setAttribute("class", "icon-cancel-circled");
	delAnchor.appendChild(delIcon);
	del.appendChild(delAnchor);
	
	return del;
}

taskView.prototype.makeTaskElement = function(callbackConfig) {
	var listItem = this.makeTaskContainer();
	var playElement = this.makePlayElement();
	var titleElement = this.makeTitleElement();
	var totalElement = this.makeTotalElement();
	var deleteElement = this.makeDeleteElement();
	
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