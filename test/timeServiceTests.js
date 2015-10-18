function verifyExpectedHms(assert, expected, hms) {
	assert.ok( hms == expected, "Expected "+expected+", got "+hms );
}

QUnit.test( "HMS for 60 seconds is one minute", function( assert ) {
	var input = 60;
	var expected = "00:01:00";
	var hms = tt.timeService.formatSecondsAsHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, hms);
});
QUnit.test( "HMS for 3600 seconds is one hour", function( assert ) {
	var input = 3600;
	var expected = "01:00:00";
	var hms = tt.timeService.formatSecondsAsHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, hms);
});
QUnit.test( "HMS for 124200 seconds is 34.5 hours", function( assert ) {
	var input = 124200;
	var expected = "34:30:00";
	var hms = tt.timeService.formatSecondsAsHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, hms);
});

QUnit.test( "Seconds for 00:01:00 is 60 seconds", function( assert ) {
	var input = "00:01:00";
	var expected = 60;
	var seconds = tt.timeService.getSecondsFromHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, seconds);
});
QUnit.test( "Seconds for 01:00:00 is 3600", function( assert ) {
	var input = "01:00:00";
	var expected = 3600;
	var seconds = tt.timeService.getSecondsFromHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, seconds);
});
QUnit.test( "Seconds for 34:30:00 is 124200 seconds", function( assert ) {
	var input = "34:30:00";
	var expected = 124200;
	var seconds = tt.timeService.getSecondsFromHourMinuteSecond(input);
	verifyExpectedHms(assert, expected, seconds);
});