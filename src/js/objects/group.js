'use strict';

function group() {
    this.id = "";
    this.title = "";
    this.tasks = [];
    observableObject.call(this);
}

group.prototype = Object.create(observableObject.prototype);
group.prototype.constructor = group;

group.prototype.addTask = function(task) {
    var thisGroup = this;
    task.subscribe('total-modified', function(e) {
        thisGroup.publish('total-modified');
    });
    this.tasks.push(task);
    this.publish('task-added', { 'task' : task });
}
group.prototype.removeTask = function(task) {
    var index = this.tasks.indexOf(task);
    if (index > -1) {
        this.tasks.splice(index, 1);
    }
    this.publish('task-removed', { 'task' : task });
}
group.prototype.getTotal = function() {
    var total = 0.00;
    for (var i = 0, len = this.tasks.length; i < len; i++) {
        total += this.tasks[i].runtime;
    }
    return tt.timeService.formatSecondsAsHourMinuteSecond(total);
}