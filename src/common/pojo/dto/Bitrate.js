
export class Bitrate {

    constructor(timer, bsnow, bsbefore, tsnow, tsbefore, value) {
        this._timer = timer;
        this._bsnow = bsnow;
        this._bsbefore = bsbefore;
        this._tsnow = tsnow;
        this._tsbefore = tsbefore;
        this._value = value;
    }

    static of(timer, bsnow, bsbefore, tsnow, tsbefore, value) {
        return new Bitrate(timer, bsnow, bsbefore, tsnow, tsbefore, value);
    }

    get timer() {
        return this._timer;
    }

    set timer(value) {
        this._timer = value;
    }

    get bsnow() {
        return this._bsnow;
    }

    set bsnow(value) {
        this._bsnow = value;
    }

    get bsbefore() {
        return this._bsbefore;
    }

    set bsbefore(value) {
        this._bsbefore = value;
    }

    get tsnow() {
        return this._tsnow;
    }

    set tsnow(value) {
        this._tsnow = value;
    }

    get tsbefore() {
        return this._tsbefore;
    }

    set tsbefore(value) {
        this._tsbefore = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}