'use strict';

var tt = tt || {};
tt.ui = (function(logger, win) {

	function clearElement(el) {
		if (el === null || typeof(el) === 'undefined') return;
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	}	
	
	return { 
		clearElement
	};

})(logger, this);