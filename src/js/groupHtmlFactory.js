'use strict';

var tt = tt || {};
tt.groupHtmlFactory = (function(logger, eventService, win) {
	
	var groupContainer = document.querySelector("#groupContainer");
	
	function makeGroupNavigation(groups) {
		var navList = groupContainer.querySelector('ul:first-child');
		navList.textContent = "";
		for (var i = 0, len = groups.length; i < len; i++) {
			var groupNavElement = makeGroupNavElement(groups[i]);
			navList.appendChild(groupNavElement);
		}
	}
	
	function makeGroupNavElement(group) {
		
		var groupListItem = win.document.createElement("li");
		groupListItem.setAttribute("data-groupid", group.id);
		
		var groupAnchor = win.document.createElement("a");
		groupAnchor.setAttribute("href", "#" + group.id);
		groupAnchor.setAttribute("title", "View group (" + group.name + ")");
		groupAnchor.addEventListener('click', function(e) {
			eventService.dispatch(eventService.events.group.selected, { 'detail' : group });
			e.preventDefault();
		}, false);
		
		var groupText = win.document.createTextNode(group.name + " ");
		
		var groupTotal = win.document.createElement("span");
		groupTotal.classList.add("paren-data");
		groupTotal.textContent = group.total;		
		
		groupAnchor.appendChild(groupText);
		groupAnchor.appendChild(groupTotal);
		groupListItem.appendChild(groupAnchor);
		
		return groupListItem;
	}
	
	return {
		makeGroupNavigation
	}
	
})(logger, tt.eventService, this);