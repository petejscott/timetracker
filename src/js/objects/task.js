'use strict';

function task() {

    this.id = "";
    this.groupId = "";
    this.title = "";
    this.runtime = 0.00;
    this.isComplete = false;
    this.isComplete = false;
    this.isRunning = false;
    this.intervalId = null;

    observableObject.call(this);
}

task.prototype = Object.create(observableObject.prototype);
task.prototype.constructor = task;

task.prototype.getRuntime = function() {
    return this.runtime;
}
task.prototype.setRuntime = function(val) {
    this.runtime = val;
    this.publish('total-modified');
}
task.prototype.getTotal = function() {
    return tt.timeService.formatSecondsAsHourMinuteSecond(this.runtime);
}