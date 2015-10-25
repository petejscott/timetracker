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