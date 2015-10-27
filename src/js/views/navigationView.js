'use strict';

function navigationView(logger, appData, eventService, groupFactory, taskFactory, viewFactory) {

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

        if (i == (appData.groups.length - 1)) {
            g.publish('group-selected');
        }
    }

    appData.subscribe('group-added', groupSelectedEventHandling);
    appData.subscribe('group-added', createGroupNavigationView);

    function groupSelectedEventHandling(e) {
        var g = e.detail.group;
        if (g == null) return;

        g.subscribe('group-selected', createTaskListView);
        g.subscribe('group-selected', createGroupSummaryView);
        g.subscribe('delete-group', removeGroupFromCollection);
    }

    function removeGroupFromCollection(e) {
        appData.removeGroup(e.target);
    }

    function createTaskListView(e) {
        var g = e.target;
        if (g == null) return;
        viewFactory.makeTaskListView(g, taskFactory);
    }
    function createGroupSummaryView(e) {
        var g = e.target;
        if (g == null) return;
        viewFactory.makeGroupSummaryView(g);
    }
    function createGroupNavigationView(e) {
        var g = e.detail.group;
        if (g == null) return;

        var groupNavigationView = viewFactory.makeGroupNavigationView(g);
        var el = groupNavigationView.getElement();
        el.querySelector(".action-delete-group").addEventListener('click', function(e) {
            appData.removeGroup(g);
            eventService.dispatch(eventService.events.sync.statusUpdated, { 'detail' : 'not synced' });
            e.preventDefault();
        }, false);

        groupNavigationContainer.appendChild(el);
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