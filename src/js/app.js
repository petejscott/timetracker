'use strict';

var tt = tt || {};
tt.app = (function(logger, groupFactory, taskFactory, viewFactory, eventService) {

	var appData = new AppData();
    Object.seal(appData);
    appData.setConfig(tt.config);
    registerAppDataSync(appData);

    function registerAppDataSync(appData) {
        appData.subscribe('group-added', requestHighPrioritySync);
        appData.subscribe('group-removed', requestHighPrioritySync);

        appData.subscribe('group-added', function(e) { registerGroupSync(e.detail.group); });
        for (var i = 0, len = appData.groups.length; i < len; i++) {
            registerGroupSync(appData.groups[i]);
        }
    }

    function registerGroupSync(group) {
        group.subscribe('group-title-modified', requestHighPrioritySync);
        group.subscribe('total-modified', requestLowPrioritySync);
        group.subscribe('task-added', requestHighPrioritySync);
        group.subscribe('task-removed', requestHighPrioritySync);

        group.subscribe('task-added', function(e) { registerTaskSync(e.detail.task); });
        for (var i = 0, len = group.tasks.length; i < len; i++) {
           registerTaskSync(group.tasks[i]);
        }
    }

    function registerTaskSync(task) {
        task.subscribe('task-title-modified', requestHighPrioritySync);
        task.subscribe('task-state-toggled', requestHighPrioritySync);
    }

	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
                appData.addGroup(groupFactory.createGroup(storedGroups[i]));
			}
		}
		createViews();
	}
	
	function createViews() {
		viewFactory.makeNavigationView(appData, groupFactory, taskFactory);
		viewFactory.makeSyncStatusView(requestHighPrioritySync);
	}

    function requestHighPrioritySync() {
        requestSync('high');
    }
    function requestLowPrioritySync() {
        requestSync('low');
    }
    function requestSync(priority) {
        eventService.dispatch(eventService.events.sync.requested, {
            'detail' : {
                'type': 'groups',
                'data': appData.groups,
                'priority': priority
            }
        });
    }

    eventService.subscribe(eventService.events.sync.groupsRetrieved, groupsRetrievedEventHandler);
	eventService.dispatch(eventService.events.sync.getGroups);
	
})(logger, tt.groupFactory, tt.taskFactory, tt.viewFactory, tt.eventService);