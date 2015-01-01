'use strict';

var tt = tt || {};
tt.ui = (function(logger, win) {

	function clearElement(el) {
		if (el === null || typeof(el) === 'undefined') return;
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	}
	
	function createWeekNavElement(week) {
		var weekAnchor = win.document.createElement("a");
		weekAnchor.setAttribute("href", "#week-" + week.id);
		weekAnchor.setAttribute("title", "View week " + week.name);
		
		var weekText = win.document.createTextNode(week.name + " ");
		
		var weekTotal = win.document.createElement("span");
		weekTotal.classList.add("paren-data");
		weekTotal.textContent = week.total;
		
		var weekListItem = win.document.createElement("li");
		
		// <li><a href="#item1" title="Load tasks for this week NN">Week NN <span class="paren-data">NN:NN</span></a></li>
		weekAnchor.appendChild(weekText);
		weekAnchor.appendChild(weekTotal);
		weekListItem.appendChild(weekAnchor);
		
		return weekListItem;
	}
	
	//function createTaskLineItem(task)
	//function renderTasksForWeekDay(day)
	//function renderCurrentDaySummary(day)
	//function setActiveWeekDay(activeDayIndex)
	
	function renderWeekNavigation(weeks) {
		var navList = win.document.querySelector('nav ul');
		clearElement(navList);
		for (var i = 0, len = weeks.length; i < len; i++) {
			var weekNavElement = createWeekNavElement(weeks[i]);
			navList.appendChild(weekNavElement);
		}
	}
	
	function renderCurrentWeekSummary(week) {
		var currentWeekNameElement = win.document.querySelector(".week-name");
		currentWeekNameElement.textContent = week.name;
		var currentWeekTotalElement = win.document.querySelector(".week-total");
		currentWeekTotalElement.textContent = week.total;
	}
	
	return { 
		renderWeekNavigation : renderWeekNavigation,
		renderCurrentWeekSummary : renderCurrentWeekSummary
	};

})(logger, this);