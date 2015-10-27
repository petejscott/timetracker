QUnit.test( "appData.setConfig and getConfig return same config", function( assert ) {
	var expectedConfig = { 'foo' : 'bar' };
	var appData = new AppData();
    appData.setConfig(expectedConfig);
    assert.ok( appData.getConfig() === expectedConfig );
});

QUnit.test( "appData.addGroup adds group to collection", function( assert ) {
    var group = tt.groupFactory.createNewGroup();
    var appData = new AppData();
    assert.ok( appData.groups.length === 0 );
    appData.addGroup(group);
    assert.ok( appData.groups.length === 1 );
});