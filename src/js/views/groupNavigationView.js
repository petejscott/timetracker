'use strict';

function groupNavigationView(group, eventService) {
	this.group = group;
	this.eventService = eventService;
    var element = this.makeGroupNavElement(getViewTemplate());
    var groupTotalContainer = element.querySelector(".group-total");
    this.element = element;
	
	this.onGroupTitleChangedEvent(this);

    group.subscribe('total-modified', updateTotal);
    group.subscribe('group-removed', removeGroup);

    function removeGroup() {
        element.remove();
    }

    function updateTotal(e) {
        var g = e.target;
        groupTotalContainer.textContent = g.getTotal();
    }

	function getViewTemplate() {
		return 	'<a class="action-select-group" href="" title=""><span class="group-title"></span><span class="group-total paren-data"></span></a>' + 
				'<a class="action-delete-group" href="" title=""><i class="icon-cancel-circled"></i></a>';
	}
}

groupNavigationView.prototype.onGroupTitleChangedEvent = function(view) {
	this.group.subscribe('change-group-title', function() { view.updateGroupTitle(view.group.title); });
}

groupNavigationView.prototype.getElement = function() {
	return this.element;
}

groupNavigationView.prototype.updateGroupTitle = function() {
	var groupNameElement = this.element.querySelector(".group-title");
	groupNameElement.textContent = this.group.title;
	groupNameElement.setAttribute("title", "View group (" + this.group.title + ")");
}

groupNavigationView.prototype.makeGroupNavElement = function(template) {
	
	var groupListItem = document.createElement("li");
	groupListItem.innerHTML = template;
	
	groupListItem.querySelector('.group-title').textContent = this.group.title;
	groupListItem.querySelector('.group-total').textContent = this.group.getTotal();
	groupListItem.querySelector('.action-select-group').setAttribute('href', '#select-' + this.group.id);
	groupListItem.querySelector('.action-select-group').setAttribute('title', 'View group (' + this.group.title + ')');
	groupListItem.querySelector('.action-delete-group').setAttribute('href', '#delete-' + this.group.id);
	groupListItem.querySelector('.action-delete-group').setAttribute('title', 'View group (' + this.group.title + ')');
	
	var thisView = this;
	groupListItem.querySelector(".action-select-group").addEventListener('click', function(e) {
		thisView.group.publish('group-selected');
		e.preventDefault();
	}, false);
	
	return groupListItem;
}