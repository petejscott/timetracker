'use strict';

var tt = tt || {};
tt.timeManager = (function(logger, weekFactory, ui) {

	var weeks = [];
	
	function getStartOfWeek(date) {
		var d = new Date(date);
		var day = d.getDay();
		var diff = d.getDate() - day;
		return new Date(d.setDate(diff));
	}
	function getEndOfWeek(date) {
		var d = getStartOfWeek(date);
		var diff = d.getTime() + 6*24*60*60*1000;
		return new Date(diff);
	}
	function getCurrentWeekName() {
		var currentDay = new Date();
		var currentWeekStartDate = getStartOfWeek(currentDay);
		var strStart = (currentWeekStartDate.getMonth() + 1) + "/" + currentWeekStartDate.getDate();
		var currentWeekEndDate = getEndOfWeek(currentDay);
		var strEnd = (currentWeekEndDate.getMonth() + 1) + "/" + currentWeekEndDate.getDate();
		return "Week of " + strStart + " - " + strEnd;
	}
	function createCurrentWeek() {
		weeks.push(weekFactory.createNewWeek(getCurrentWeekName()));
	}
	function init() {
		// make sure we have a week for *this* week
		if (weeks.length === 0 || weeks[0].name !== getCurrentWeekName()) {
			createCurrentWeek();
		}
		
		ui.renderWeekNavigation(weeks);
		ui.renderCurrentWeekSummary(weeks[0]);
	}
	
	init();

})(logger, tt.weekFactory, tt.ui);
