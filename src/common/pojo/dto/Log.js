
export class Log {

    constructor(className, methodName, paramName, value) {
        this._className = className;
        this._methodName = methodName;
        this._paramName = paramName;
        this._value = value;
    }

    static of(className, methodName, paramName, value) {
        return new Log(className, methodName, paramName, value);
    }

    get className() {
        return this._className;
    }

    set className(value) {
        this._className = value;
    }

    get methodName() {
        return this._methodName;
    }

    set methodName(value) {
        this._methodName = value;
    }

    get paramName() {
        return this._paramName;
    }

    set paramName(value) {
        this._paramName = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}