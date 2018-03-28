const getControlledPromise = (mapValue = {}) => 
    Object.assign(mapValue, {
        promise: new Promise((resolve, reject) => 
            Object.assign(mapValue, {resolve, reject})
        )
    });

module.exports = class {
    constructor() {
        this.eventPromiseMap = new Map();
    }
    once(event) {
        return (
            this.eventPromiseMap.get(event) || 
            this.eventPromiseMap.set(event, getControlledPromise()).get(event) 
        ).promise;
    }
    on(successEvents = [], rejectEvents = []) {
        return Promise.race([
            ...[].concat(successEvents).map(eventName => this.once(eventName)),
            ...[].concat(rejectEvents).map(eventName => this.once(eventName).then(data => Promise.reject(data)))
        ]);
    }
    all(events = []) {
        return Promise.all(events.map(eventName => this.once(eventName)));
    }
    off(event, reason = 'Handler was removed') {
        return this._abstract(event, 'reject', reason);
    }
    emit(event, ...args) {
        return this._abstract(event, 'resolve', ...args);
    }
    _abstract(event, type, ...args) {
        (this.eventPromiseMap.get(event) || {[type](){}})[type](args);
        return this.eventPromiseMap.delete(event);
    }
    eventNames() {
        return [...this.eventPromiseMap.keys()];
    }
}