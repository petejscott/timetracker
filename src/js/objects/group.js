'use strict';

function group() {
    this.tasks = [];
    observableObject.call(this);
}

group.prototype = Object.create(observableObject.prototype);
group.prototype.constructor = group;

group.prototype.addTask = function(task) {
    this.tasks.push(task);
}