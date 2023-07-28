export class Coords {

    constructor(lstHeader, row, col) {
        this._x = row;
        this._y = col;
        this._value = lstHeader[col][row];
    }

    static of(lstHeader, row, col) {
        return new Coords(lstHeader, row, col);
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}