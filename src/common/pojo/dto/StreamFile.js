
export class StreamFile {

    constructor(name, percentage, raw, size, status, uid) {
        this._name = name;
        this._percentage = percentage;
        this._raw = raw;
        this._size = size;
        this._status = status;
        this._uid = uid;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get percentage() {
        return this._percentage;
    }

    set percentage(value) {
        this._percentage = value;
    }

    get raw() {
        return this._raw;
    }

    set raw(value) {
        this._raw = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }
}