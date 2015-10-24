'use strict';

function observableObject() {
	this.subscribers = [];
}

observableObject.prototype.publish = function(type, detail) {
	logger.logDebug('publishing ' + type + ' with ' + JSON.stringify(detail));
	for( var i = 0, len = this.subscribers.length; i < len; i++) {
		if (this.subscribers[i].type == type) {
			this.subscribers[i].fn({'detail' : detail});
		}
	}
}
observableObject.prototype.subscribe = function(type, fn) {
	logger.logDebug('got subscribe for ' + type);
	this.subscribers.push({ 'type' : type, 'fn' : fn});
}