'use strict';

function NavigationView(logger, appData, eventService, groupFactory, taskFactory, viewFactory) {

	var groupNavigationContainer = document.querySelector("#mainNavigation ul.group-nav");
	var optionsNavigationContainer = document.querySelector("#mainNavigation ul.options-nav");

    if (groupNavigationContainer == null) {
        logger.logWarning("Missing navigationView.groupNavigationContainer");
        return;
    }

    makeOptions();

    for (var i = 0, len = appData.groups.length; i < len; i++)
    {
        var g = appData.groups[i];
        groupSelectedEventHandling({ 'detail' : { 'group' : g }});
        createGroupNavigationView({ 'detail' : { 'group' : g}});


        selectLastGroup();
    }

    appData.subscribe('group-added', groupSelectedEventHandling);
    appData.subscribe('group-added', createGroupNavigationView);

    function selectLastGroup() {
        var lastGroup = appData.groups[(appData.groups.length - 1)];
        if (typeof lastGroup === 'undefined') return;
        lastGroup.publish('on-group-select');
    }

    function groupSelectedEventHandling(e) {
        var g = e.detail.group;
        if (g == null) return;

        g.subscribe('on-group-select', selectGroup);
        g.subscribe('on-group-remove', removeGroupFromCollection);
    }

    function selectGroup(e) {
        var selectedGroup = e.target;
        if (selectedGroup == null) return;

        createTaskListView(selectedGroup);
        createGroupSummaryView(selectedGroup);
    }

    function createTaskListView(g) {
        viewFactory.makeTaskListView(g, taskFactory);
    }

    function createGroupSummaryView(g) {
        var groupSummaryContainer = document.querySelector(".group-summary");
        groupSummaryContainer.textContent = "";
        var sumView = viewFactory.makeGroupSummaryView(g);
        groupSummaryContainer.appendChild(sumView.getElement());
    }

    function createGroupNavigationView(e) {
        var g = e.detail.group;
        if (g == null) return;

        var groupNavigationView = viewFactory.makeGroupNavigationView(g);
        var el = groupNavigationView.getElement();
        groupNavigationContainer.appendChild(el);
    }

    function removeGroupFromCollection(e) {
        appData.removeGroup(e.target);
        selectLastGroup();
        eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
    }

	function createGroupForCurrentWeek() {
		var group = groupFactory.createNewGroup();
        appData.addGroup(group);
	}
	
	function makeOptions() {

		groupNavigationContainer.textContent = "";

		optionsNavigationContainer.innerHTML = '<li><a href="#group-add" title="Add a Group" class="action-group-add icon-plus-circled">Add a Group</a></li>';
		optionsNavigationContainer.querySelector('.action-group-add').addEventListener('click', function(e) {
			createGroupForCurrentWeek();
			eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
			e.preventDefault();
		}, false);
	}
}