'use strict';

var tt = tt || {};
tt.app = (function(logger, groupFactory, taskFactory, viewFactory, eventService) {

	var appData = new AppData();
    Object.seal(appData);
    appData.setConfig(tt.config);
	
	function groupsRetrievedEventHandler(e) {
		
		var storedGroups = e.detail;
		if (storedGroups !== null) {
			for(var i = 0, len = storedGroups.length; i < len; i++) {
                appData.addGroup(groupFactory.createGroup(storedGroups[i]));
			}
		}
		createViews();
        scheduleSync();
	}
	
	function createViews() {
		viewFactory.makeNavigationView(appData, groupFactory, taskFactory);
		viewFactory.makeSyncStatusView(requestHighPrioritySync);
	}

    function scheduleSync() {
        appData.subscribe('group-added', requestHighPrioritySync);
        appData.subscribe('group-removed', requestHighPrioritySync);

        for (var i = 0, gLen = appData.groups.length; i < gLen; i++) {
            var group = appData.groups[i];
            group.subscribe('group-title-modified', requestHighPrioritySync);
            group.subscribe('total-modified', requestLowPrioritySync);
            group.subscribe('task-added', requestHighPrioritySync);
            group.subscribe('task-removed', requestHighPrioritySync);
            for (var j = 0, tLen = group.tasks.length; j < tLen; j++) {
                var task = group.tasks[j];
                task.subscribe('task-title-modified', requestHighPrioritySync);
                task.subscribe('task-state-toggled', requestHighPrioritySync);
            }
        }
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