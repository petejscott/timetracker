'use strict';

var tt = tt || {};
tt.groupHtmlFactory = (function(logger, eventService, win) {
	
	var groupNavigationContainer = document.querySelector("#groupContainer ul");
	
	function makeGroupNavigation(groups) {
		groupNavigationContainer.textContent = "";
		for (var i = 0, len = groups.length; i < len; i++) {
			appendGroupToGroupNavigation(groups[i]);
		}
	}
	
	function appendGroupToGroupNavigation(group) {
		var groupNavElement = makeGroupNavElement(group);
		groupNavigationContainer.appendChild(groupNavElement);
	}
	
	function updateGroupTotalInGroupNavigation(group) {
		console.log(group);
		var groupNavElement = groupNavigationContainer.querySelector("li[data-groupid='" + group.id + "']");
		var groupTotalElement = groupNavElement.querySelector(".group-total");
		groupTotalElement.textContent = group.total;
	}
	
	function updateGroupNameInGroupNavigation(group) {
		var groupNavElement = groupNavigationContainer.querySelector("li[data-groupid='" + group.id + "']");
		var groupNameElement = groupNavElement.querySelector(".group-name");
		groupNameElement.textContent = group.name;
		groupNameElement.setAttribute("title", "View group (" + group.name + ")");
	}
	
	function makeGroupNavElement(group) {
		
		var groupListItem = win.document.createElement("li");
		groupListItem.setAttribute("data-groupid", group.id);
		
		var groupAnchor = win.document.createElement("a");
		groupAnchor.classList.add("group-name");
		groupAnchor.setAttribute("href", "#" + group.id);
		groupAnchor.setAttribute("title", "View group (" + group.name + ")");
		groupAnchor.addEventListener('click', function(e) {
			eventService.dispatch(eventService.events.group.selected, { 'detail' : { 'group' : group, 'groupId' : group.id }});
			e.preventDefault();
		}, false);
		
		var groupText = win.document.createTextNode(group.name + " ");
		
		var groupTotal = win.document.createElement("span");
		groupTotal.classList.add("group-total");
		groupTotal.classList.add("paren-data");
		groupTotal.textContent = group.total;		
		
		groupAnchor.appendChild(groupText);
		groupAnchor.appendChild(groupTotal);
		groupListItem.appendChild(groupAnchor);
		
		return groupListItem;
	}
	
	return {
		makeGroupNavigation,
		appendGroupToGroupNavigation,
		updateGroupTotalInGroupNavigation,
		updateGroupNameInGroupNavigation
	}
	
})(logger, tt.eventService, this);