'use strict';

function AppData() {
    this.groups = [];
    this.configuration = {};
    ObservableObject.call(this);
}

AppData.prototype = Object.create(ObservableObject.prototype);
AppData.prototype.constructor = AppData;

AppData.prototype.addGroup = function(group) {
    this.groups.push(group);
    this.publish('group-added', { 'group' : group });
};
AppData.prototype.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index > -1) {
        this.groups.splice(index, 1);
    }
    group.publish('group-removed');
    this.publish('group-removed', { 'group' : group });
};
AppData.prototype.setConfig = function(config) {
    this.configuration = config;
};
AppData.prototype.getConfig = function() {
    return this.configuration;
};