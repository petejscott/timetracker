'use strict';

function groupsNavigationView(groups, viewFactory) {
	this.groups = groups;
	this.viewFactory = viewFactory;
	this.groupNavigationContainer = document.querySelector("#groupContainer ul");
}

groupsNavigationView.prototype.makeGroupNavigation = function() {
	this.groupNavigationContainer.textContent = "";
	for (var i = 0, len = this.groups.length; i < len; i++) {
		var groupNavigationView = this.viewFactory.makeGroupNavigationView(this.groups[i]);
		this.groupNavigationContainer.appendChild(groupNavigationView.getElement());
	}
}