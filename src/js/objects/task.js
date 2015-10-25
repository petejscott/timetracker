'use strict';

function task() {
    observableObject.call(this);
}

task.prototype = Object.create(observableObject.prototype);
task.prototype.constructor = task;