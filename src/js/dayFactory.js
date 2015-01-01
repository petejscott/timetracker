'use strict';

var tt = tt || {};
tt.dayFactory = (function(logger) {

	function createNewDay(name) {
		return { 
			name : name,
			tasks : [],
			total : 0.00
		};
	}
	
	function createDay(data) {
		return { 
			name : data.name,
			tasks : data.tasks,
			get total () { 			
				var total = 0.00;
				for (var i = 0, len = tasks.length; i < len; i++) {
					total += tasks[i].total;
				}
				return total;
			}
		}
	}
	
	return { 
		createNewDay : createNewDay,
		createDay : createDay
	};
	
})(logger);