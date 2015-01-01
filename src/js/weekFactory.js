'use strict';

var tt = tt || {};
tt.weekFactory = (function(logger) {

	function createNewWeek(name) {
		return { 
			name : name,
			id : 0,
			activeDayIndex : 0, // should be a getter for current day.
			days : [ 
				tt.dayFactory.createNewDay('Sunday'), 
				tt.dayFactory.createNewDay('Monday'), 
				tt.dayFactory.createNewDay('Tuesday'), 
				tt.dayFactory.createNewDay('Wednesday'), 
				tt.dayFactory.createNewDay('Thursday'), 
				tt.dayFactory.createNewDay('Friday'), 
				tt.dayFactory.createNewDay('Saturday')
			],
			total : 0.00
		};
	}
	
	function createWeek(data) {
		return { 
			name : data.name,
			id : data.id,
			activeDayIndex : data.activeDayIndex,
			days : data.days,
			get total () { 			
				var total = 0.00;
				for (var i = 0, len = days.length; i < len; i++) {
					total += days[i].total;
				}
				return total;
			}
		}
	}
	
	return { 
		createNewWeek : createNewWeek,
		createWeek : createWeek
	};

})(logger);