import {debounce} from "lodash-es";
import EventEmitter2 from "eventemitter2";
import {GenUtil} from "@/common/util/GenUtil";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {Message} from "element-ui";

export class CommonService extends EventEmitter2 {

    static service;
    static mapVue = new Map();
    static _emitter = new EventEmitter2();

    constructor(vue) {
        super();
        this._vue = vue;
        if (CommonService.mapVue.size === 0) CommonService.service = this;
        CommonService.mapVue.set(this.getServiceName() + (this.getProp("index") || 0), this.vue);
    }

    getVue(name, index) {
        index = index || (name === this.getServiceName() ? (this.getProp("index") || 0) : 0);
        return CommonService.mapVue.get(name + index);
    }

    getServiceName(className) {
        if (typeof className === "undefined") {
            className = this.getClassName();
        }
        return className[0].toLowerCase() + className.substring(1);
    }

    getClassName() {
    }

    hasService(clazz, index) {
        let serviceName = this.getServiceName(clazz.class);
        let vue = this.getVue(serviceName, index || 0);
        return typeof vue !== "undefined";
    }

    getService(clazz, index) {
        let serviceName = this.getServiceName(clazz.class);
        let vue = this.getVue(serviceName, index || 0);
        return vue[serviceName];
    }

    screenResizeWatch() {
        window.addEventListener("resize", debounce(async () => {
            let screenHeight = document.documentElement.clientHeight + "px";
            let tempScreenHeight = (document.documentElement.clientHeight + 20) + "px";
            LogUtil.loggerLine(Log.of("WallpaperPlusService", "initData", "screenHeight", screenHeight));
            do {
                await this.setStyleHeight();
                await GenUtil.sleep(333);
                LogUtil.loggerLine(Log.of("WallpaperPlusService", "initData", "styleHeight", CommonService.styleHeight()));
            } while (tempScreenHeight !== CommonService.styleHeight());
        }, 333));
    }

    async getStripByType(type) {
        let scroll = undefined;
        do {
            scroll = this.getRef("scroll");
            await GenUtil.sleep(10);
        } while (typeof scroll === "undefined");
        if (typeof scroll === "undefined") return {};

        let children = scroll.$children;
        for (let child of children) {
            let className = child.$el.className;
            if (!className.includes(type)) continue;
            return child;
        }
        return {};
    }

    async setStyleHeight() {
        let screenHeight = document.documentElement.clientHeight + "px";
        let scroll = document.getElementsByClassName("happy-scroll")[0];
        scroll.setAttribute("style", "height: " + screenHeight);

        let tempScreenWidth = (document.documentElement.clientWidth + 20) + "px";
        let tempScreenHeight = (document.documentElement.clientHeight + 20) + "px";
        const tempScroll = document.getElementsByClassName("happy-scroll-container")[0];
        tempScroll.setAttribute("style", "width: " + tempScreenWidth + "; height: " + tempScreenHeight);

        scroll = document.getElementsByClassName("happy-scroll")[0];
        const slotEle = document.getElementById("content-details");
        const verticalStrip = await this.getStripByType("vertical");
        verticalStrip?.computeStrip(slotEle.scrollHeight, scroll.clientHeight);
        const horizontalStrip = await this.getStripByType("horizontal");
        horizontalStrip?.computeStrip(slotEle.scrollWidth, scroll.clientWidth);
    }

    static styleHeight() {
        const scroll = document.getElementsByClassName("happy-scroll-container")[0];
        return scroll.style.height;
    }

    success(msg) {
        Message.success(msg);
    }

    warning(msg) {
        Message.warning(msg);
    }

    error(msg) {
        Message.error(msg);
    }

    info(msg) {
        Message.info(msg);
    }

    toTest() {
        this.toRouter("/test");
    }

    toRouter(path, query) {
        let uid = GenUtil.getUrlKey("uid");
        if (typeof uid !== "undefined" && uid.length > 0) {
            typeof query === "undefined" ? query = {uid: uid} : query.uid = uid;
        }
        this.vue.$router.push(typeof query === "undefined" ? {path: path} : {path: path, query: query}).then();
    }

    get service() {
        return this.vue[this.getServiceName()];
    }

    get routerName() {
        return this.vue.$router.currentRoute.name;
    }

    getValue(name) {
        return this.vue[name];
    }

    getProp(name) {
        return this.vue.$props ? this.vue.$props[name] : undefined;
    }

    getRef(name) {
        return this.vue.$refs[name];
    }

    get emitter() {
        return CommonService._emitter;
    }

    get vue() {
        return this._vue;
    }

}