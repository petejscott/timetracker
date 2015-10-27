QUnit.test( "appData.setConfig and getConfig return same config", function( assert ) {
	var expectedConfig = { 'foo' : 'bar' };
	appDataInstance = new AppData();
    appDataInstance.setConfig(expectedConfig);
    assert.ok( appDataInstance.getConfig() === expectedConfig );
});

QUnit.test( "appData.addGroup adds group to collection", function( assert ) {
    var group = tt.groupFactory.createNewGroup();
    appDataInstance = new AppData();
    assert.ok( appDataInstance.groups.length === 0 );
    appDataInstance.addGroup(group);
    assert.ok( appDataInstance.groups.length === 1 );
});