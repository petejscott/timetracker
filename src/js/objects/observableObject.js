'use strict';

function ObservableObject() {
	this.subscribers = [];
    this.isPublishing = 0;
}

ObservableObject.prototype.publish = function(type, detail) {
    if (typeof detail === 'undefined') detail = {};
	logger.logDebug('publishing ' + type + ' with ' + JSON.stringify(detail));

    this.isPublishing++;
	for (var i = 0, len = this.subscribers.length; i < len; i++) {
        if (this.subscribers[i] == null) continue;
		if (this.subscribers[i].type == type) {
			this.subscribers[i].fn({
				'detail' : detail, 
				'target' : this});
		}
	}
    this.isPublishing--;
};
ObservableObject.prototype.subscribe = function(type, fn) {
	logger.logDebug('got subscribe for ' + type);
	this.subscribers.push({ 'type' : type, 'fn' : fn});
};