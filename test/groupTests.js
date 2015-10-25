QUnit.test( "group tasks is empty on new group", function( assert ) {
	var group = tt.groupFactory.createNewGroup();
	assert.ok( group.tasks.length == 0, "Expected 0 tasks, got "+group.tasks.length );
});
QUnit.test( "group.addTask adds task", function( assert ) {
	var group = tt.groupFactory.createNewGroup();
	var task = { 'title' : 'test task' };
	group.addTask(task);
	
	assert.ok( group.tasks.length == 1, "Expected 1 task, got "+group.tasks.length );
});
QUnit.test( "group.total returns task total", function( assert ) {
	var expectedTotal = "02:46:39";
	var runtimeTotal = 9999;
	
	var group = tt.groupFactory.createNewGroup();
	var task = tt.taskFactory.createNewTask(group);
	task.runtime = runtimeTotal;
	
	group.addTask(task);
	var groupTotal = group.total;
	
	assert.ok( groupTotal == expectedTotal, "Expected "+expectedTotal+" for groupTotal, got "+groupTotal );
});