'use strict';

function GroupSummaryView(group, eventService) {
	
	var groupSummaryContainer = document.querySelector(".group-summary");
	groupSummaryContainer.innerHTML = getViewTemplate();

	var editableTimeoutId = null;
	
	setTitle();
	setTotal();
    group.subscribe('total-modified', setTotal);
    group.subscribe('group-title-modified', setTitle);
	
	listenForGroupTitleChanges();


    function setTotal() {
        groupSummaryContainer.querySelector(".group-total").textContent = group.getTotal();
    }

    function setTitle() {
        groupSummaryContainer.querySelector(".group-title").textContent = group.title;
    }

    function listenForGroupTitleChanges() {
        groupSummaryContainer.querySelector(".group-title").addEventListener('input', function(e) {

            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            group.title = groupSummaryContainer.querySelector(".group-title").textContent;
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
