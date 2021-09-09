export default interface EventThrower {
    EVENT_NAMES: Record<string, string>;

    listeners: Record<string, Array<Function>>;
    addEventListener: Function;
    throwEvent: Function;
}

function addEventListener(name: string, callback: Function) {
    if (!this.listeners[name]) { this.listeners[name] = [] }
    this.listeners[name].push(callback);
}

function throwEvent(name: string, eventInfo: Object) {
    if (!this.listeners[name]) { return; }
    this.listeners[name].forEach((listener: Function) => listener({ name, ...eventInfo }));
}

export {
    addEventListener, throwEvent
}