import {DataUtil} from "@/common/util/DataUtil";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export class GenUtil {

    static async initBitrate(rtcDirec, streams, transceiver) {
        if (typeof transceiver === "undefined") return;
        let stream = streams.find(stream => stream.rtcDirec === rtcDirec);
        stream.bitrate.value = "0 kbits/sec";
        LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "transceiver", transceiver));
        if (stream.bitrate.timer) return;
        stream.bitrate.timer = setInterval(async () => {
            let stats = await transceiver.receiver.getStats();
            stats.forEach(res => {
                if (!this.isIncomingMedia(res)) return;
                stream.bitrate.bsnow = res.bytesReceived;
                stream.bitrate.tsnow = res.timestamp;
                if (stream.bitrate.bsbefore === null || stream.bitrate.tsbefore === null) {
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                } else {
                    let timePassed = stream.bitrate.tsnow - stream.bitrate.tsbefore;
                    let bitRate = Math.round((stream.bitrate.bsnow - stream.bitrate.bsbefore) * 8 / timePassed);
                    stream.bitrate.value = bitRate + ' kbits/sec';
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                }
            });
            LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "bitrate.value", stream.bitrate.value));
        }, 1000);
    }

    static isIncomingMedia(res) {
        if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) &&
            res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
            return true;
        } else if (res.type === 'ssrc' && res.bytesReceived &&
            (res.googCodecName === "VP8" || res.googCodecName === "")) {
            return true;
        }
        return false;
    }

    static timer(func, time) {
        setTimeout(func, time);
    }

    static createLinkTag(url, fileName) {
        let ele = document.createElement('a');
        ele.download = fileName;
        ele.href = url;
        ele.style.display = 'none';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
    }

    static sleep(waitTimeInMs) {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }

    static strToNumber(str) {
        return typeof str === "string" ? Number(str) : (typeof str === "undefined" || str == null ? 0 : str);
    }

    static isJson(obj) {
        return typeof obj !== "undefined" && obj !== null && obj.constructor === {}.constructor;
    }

    static arrayToObjList(lstData, clazz) {
        let lstObj = [];
        for (let data of lstData) {
            lstObj.push(
                this.isJson(data) ?
                    this.recToObj(data, clazz) :
                    this.mapToObj(data, clazz)
            );
        }
        return lstObj;
    }

    static mapToObj(mapData, clazz) {
        let entity = typeof clazz === "function" ?
            new clazz() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[methodName] = mapData.get(methodName);
        }
        return entity;
    }

    static recToObj(recData, clazz) {
        let entity = typeof clazz === "function" ?
            new clazz() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[methodName] = recData[methodName];
        }
        return entity;
    }

    static arrayToMapList(lstObj) {
        let lstData = [];
        for (let obj of lstObj) {
            lstData.push(
                !(this.isJson(obj)) ?
                    this.objToMap(obj) :
                    this.recToMap(obj)
            );
        }
        return lstData;
    }

    static recToMap(recData) {
        let mapData = new Map();
        for (let key of Object.keys(recData)) {
            mapData.set(key, recData[key]);
        }
        return mapData;
    }

    static objToMap(obj) {
        let mapData = new Map();
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            mapData.set(methodName, obj[methodName]);
        }
        return mapData;
    }

    static recToStr(record, pretty) {
        return typeof pretty === "undefined" ? JSON.stringify(record) : JSON.stringify(record, null, 2);
    }

    static arrayToRecList(lstObj) {
        let lstData = [];
        for (let obj of lstObj) {
            lstData.push(
                !(obj instanceof Map) ?
                    this.objToRecord(obj) :
                    this.mapToRecord(obj)
            );
        }
        return lstData;
    }

    static objToRecord(obj) {
        let recData = {};
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            recData[methodName] = obj[methodName];
        }
        return recData;
    }

    static mapToRecord(mapData) {
        let recData = {};
        let regStr = "^[+-]?\\d*(\\.\\d*)?(e[+-]?\\d+)?$";
        let regex = new RegExp(regStr);
        for (let [key, value] of mapData) {
            recData[key] = regex.test(value) ? this.strToNumber(value) : value;
        }
        return recData;
    }

    static strToRecord(str) {
        return JSON.parse(str);
    }

    static getKeys(data) {
        if (GenUtil.isJson(data)) {
            return Object.keys(data);
        }
        let lstKey = [];
        for (let key of data.keys()) {
            lstKey.push(key);
        }
        return lstKey;
    }

    static getUrlKey(key) {
        let url = window.location.href;
        if (url.indexOf("?") !== -1) {
            let cs_str = url.split('?')[1];
            let cs_arr = cs_str.split('&');
            let cs = {};
            for (let i = 0; i < cs_arr.length; i++) {
                cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1];
            }
            return cs[key];
        }
        return '';
    }

}