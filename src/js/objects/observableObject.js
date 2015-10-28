'use strict';

function ObservableObject() {
	var subscribers = [];
    var isPublishing = 0;

    this.pub = function(type, detail) {
        isPublishing++;
        for (var i = 0, len = subscribers.length; i < len; i++) {
            if (subscribers[i] == null) continue;
            if (subscribers[i].type == type) {
                subscribers[i].fn({
                    'detail' : detail,
                    'target' : this});
            }
        }
        isPublishing--;
    };

    this.sub = function(type, fn) {
        return subscribers.push({ 'type' : type, 'fn' : fn});
    };
}

ObservableObject.prototype.publish = function(type, detail) {
    if (typeof detail === 'undefined') detail = {};
	logger.logDebug('publishing ' + type + ' with ' + JSON.stringify(detail));
    return this.pub(type, detail);
};
ObservableObject.prototype.subscribe = function(type, fn) {
	logger.logDebug('got subscribe for ' + type);
	return this.sub(type, fn);
};