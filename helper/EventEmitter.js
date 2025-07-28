const listeners = {};

const EventEmitter = {
    on(event, callback) {
        if (!listeners[event]) listeners[event] = new Set();
        listeners[event].add(callback);

        return {
            off() {
                listeners[event].delete(callback);
            }
        };
    },

    emit(event, ...args) {
        if (!listeners[event]) return;
        listeners[event].forEach(callback => {
            callback(...args);
        });
    }
};

export default EventEmitter;
