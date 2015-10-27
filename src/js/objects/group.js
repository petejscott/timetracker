'use strict';

function Group() {
    this.id = "";
    this.title = "";
    this.tasks = [];
    ObservableObject.call(this);
}

Group.prototype = Object.create(ObservableObject.prototype);
Group.prototype.constructor = Group;

Group.prototype.addTask = function(task) {
    var thisGroup = this;
    task.subscribe('total-modified', function(e) {
        thisGroup.publish('total-modified');
    });
    this.tasks.push(task);
    this.publish('task-added', { 'task' : task });
};
Group.prototype.removeTask = function(task) {
    var index = this.tasks.indexOf(task);
    if (index > -1) {
        this.tasks.splice(index, 1);
    }
    task.publish('task-removed');
    this.publish('task-removed', { 'task' : task });
};
Group.prototype.getTotal = function() {
    var total = 0.00;
    for (var i = 0, len = this.tasks.length; i < len; i++) {
        total += this.tasks[i].runtime;
    }
    return tt.timeService.formatSecondsAsHourMinuteSecond(total);
};