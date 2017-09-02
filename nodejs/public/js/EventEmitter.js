/**
 * Simple event emitter class. Extend it in this way:
 * function MyClass() {
 *     EventEmitter.call(this);
 * }
 */
function EventEmitter() {

    var self = this;
    self.eventHandler = {};

    /**
     * Register a handler for a specific event
     */
    self.on = function(eventName, callback) {
        if (!self.eventHandler[eventName]) self.eventHandler[eventName] = [];
        self.eventHandler[eventName].push(callback);
    }

    /**
     * Send an event to the attached event handlers
     */
    self.emit = function(eventName, data) {
        if (self.eventHandler[eventName]) self.eventHandler[eventName].forEach(function(eventHandler) {
            eventHandler(data);
        });
    }

}