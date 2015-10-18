'use strict';

var tt = tt || {};
tt.taskHtmlFactory = (function(logger, win) {
	
	function makeTaskContainer(task) {
		var listItem = win.document.createElement("li");
		listItem.setAttribute("id", task.id);
		
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
	
	return {
		makeTaskContainer: makeTaskContainer,
		makePlayElement: makePlayElement,
		makeTitleElement: makeTitleElement,
		makeTotalElement: makeTotalElement,
		makeDeleteElement: makeDeleteElement
	}
	
})(logger, this);