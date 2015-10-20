'use strict';

var tt = tt || {};
tt.timeService = (function() {

	function formatSecondsAsHourMinuteSecond(seconds) {
		var h = parseInt( seconds / 3600 );
		var m = parseInt( seconds / 60 ) % 60;
		var s = seconds % 60;
		var result = 
			(h < 10 ? "0" + h : h) + ":" + 
			(m < 10 ? "0" + m : m) + ":" + 
			(s < 10 ? "0" + s : s);
		return result;
	}
	
	function getSecondsFromHourMinuteSecond(formattedTime) {
		if (formattedTime=="00:00:00"){
			return 0;
		}
		var arrTime = formattedTime.split(":");
		var s = parseFloat(arrTime[2]);
		var m = parseFloat(arrTime[1]);
		var h = parseFloat(arrTime[0]);
		m = Math.floor(h*60) +m;
		s = Math.floor(m*60) +s;
		return Math.round(s,0);
	}
	
	return {
		formatSecondsAsHourMinuteSecond,
		getSecondsFromHourMinuteSecond
	}

})();
