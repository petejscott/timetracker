'use strict';

function Task() {

    this.id = "";
    this.groupId = "";
    this.title = "";
    this.runtime = 0.00;
    this.isComplete = false;
    this.isComplete = false;
    this.isRunning = false;
    this.intervalId = null;

    ObservableObject.call(this);
}

Task.prototype = Object.create(ObservableObject.prototype);
Task.prototype.constructor = Task;

Task.prototype.getRuntime = function() {
    return this.runtime;
};
Task.prototype.setRuntime = function(val) {
    this.runtime = val;
    this.publish('total-modified');
};
Task.prototype.getTotal = function() {
    return tt.timeService.formatSecondsAsHourMinuteSecond(this.runtime);
};