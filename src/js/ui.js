'use strict';

var tt = tt || {};
tt.ui = (function(logger, win) {

	function clearElement(el) {
		if (el === null || typeof(el) === 'undefined') return;
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	}
	
	var mainContainer = win.document.querySelector("#main");
	
	//function createTaskLineItem(task)
	//function renderTasksForWeekDay(day)
	//function renderCurrentDaySummary(day)
	//function setActiveWeekDay(activeDayIndex)
	
	
	return { 
		clearElement : clearElement,
		mainContainer : mainContainer
	};

})(logger, this);