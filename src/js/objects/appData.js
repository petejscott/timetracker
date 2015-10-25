'use strict';

function appData() {
    this.groups = [];
    this.configuration = {};
    observableObject.call(this);
}

appData.prototype = Object.create(observableObject.prototype);
appData.prototype.constructor = appData;

appData.prototype.addGroup = function(group) {
    this.groups.push(group);
    this.publish('group-added', { 'group' : group });
}
appData.prototype.setConfig = function(config) {
    this.configuration = config;
}
appData.prototype.getConfig = function() {
    return this.configuration;
}