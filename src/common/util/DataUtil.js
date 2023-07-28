export class DataUtil {

    static setProps(obj, propName, value) {
        if (typeof value !== "undefined") {
            obj[propName] = value;
        }
    }

    static getPrototypes(clazz) {
        let prototype = typeof clazz === "function" ?
            clazz.prototype : Object.getPrototypeOf(clazz);
        return Object.getOwnPropertyNames(prototype)
            .filter(methodName => methodName !== 'constructor');
    }

    static convertObjectData(data, clazz) {
        let entity = typeof clazz === "function" ?
            new clazz() : clazz;
        if (!data) return entity;
        let methodNames = this.getPrototypes(clazz);
        for (let methodName of methodNames) {
            if (!data.hasOwnProperty(methodName)) continue;
            this.setProps(entity, methodName, data[methodName]);
        }
        return entity;
    }

    static convertArrayData(lstData, clazz) {
        let dataArray = [];
        for (let data of lstData) {
            dataArray.push(this.convertObjectData(data, clazz));
        }
        return dataArray;
    }

    static convertData(data, clazz) {
        if (data instanceof Array) {
            return this.convertArrayData(data, clazz);
        } else {
            return this.convertObjectData(data, clazz);
        }
    }

}