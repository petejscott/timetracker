'use strict';

function GroupNavigationView(group, eventService) {

    var element = makeGroupNavElement(getViewTemplate());
    var groupTotalContainer = element.querySelector(".group-total");
    this.element = element;
	
	onGroupTitleChangedEvent();

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

    function makeGroupNavElement(template) {
        var groupListItem = document.createElement("li");
        groupListItem.innerHTML = template;

        groupListItem.querySelector('.group-title').textContent = group.title;
        groupListItem.querySelector('.group-total').textContent = group.getTotal();
        groupListItem.querySelector('.action-select-group').setAttribute('href', '#select-' + group.id);
        groupListItem.querySelector('.action-select-group').setAttribute('title', 'View group (' + group.title + ')');
        groupListItem.querySelector('.action-delete-group').setAttribute('href', '#delete-' + group.id);
        groupListItem.querySelector('.action-delete-group').setAttribute('title', 'View group (' + group.title + ')');

        groupListItem.querySelector('.action-delete-group').addEventListener('click', function(e) {
            group.publish('on-group-remove');
            e.preventDefault();
        });

        groupListItem.querySelector(".action-select-group").addEventListener('click', function(e) {
            group.publish('on-group-select');
            e.preventDefault();
        }, false);

        return groupListItem;
    }

    function onGroupTitleChangedEvent() {
        group.subscribe('change-group-title', updateGroupTitle);
    }

    function updateGroupTitle() {
        var groupNameElement = element.querySelector(".group-title");
        groupNameElement.textContent = group.title;
        groupNameElement.setAttribute("title", "View group (" + group.title + ")");
    }
}

GroupNavigationView.prototype.getElement = function() {
	return this.element;
};
