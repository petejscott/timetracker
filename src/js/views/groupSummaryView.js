'use strict';

function GroupSummaryView(group, eventService) {
	
	var element = document.createElement("span");
    element.innerHTML = getViewTemplate();
    this.element = element;

	var editableTimeoutId = null;
	
	setTitle();
	setTotal();
    group.subscribe('total-modified', setTotal);
    group.subscribe('group-title-modified', setTitle);
	
	listenForGroupTitleChanges();

    function setTotal() {
        element.querySelector(".group-total").textContent = group.getTotal();
    }

    function setTitle() {
        element.querySelector(".group-title").textContent = group.title;
    }

    function listenForGroupTitleChanges() {
        element.querySelector(".group-title").addEventListener('input', function(e) {

            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            group.title = element.querySelector(".group-title").textContent;
            e.preventDefault();

            window.clearTimeout(editableTimeoutId);
            editableTimeoutId = window.setTimeout(function() {
                group.publish('group-title-modified');
            }, 1500);
        }, false);
    }

	function getViewTemplate() {
		return 	'<span class="group-title" contenteditable="true"></span>' +
				'<span class="group-total paren-data"></span>';
	}
}

GroupSummaryView.prototype.getElement = function() {
    return this.element;
}