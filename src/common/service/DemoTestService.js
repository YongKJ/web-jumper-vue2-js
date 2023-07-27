import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import autobind from "autobind-decorator";
import {GenUtil} from "@/common/util/GenUtil";
import {WallpaperService} from "@/common/service/WallpaperService";

export class DemoTestService extends CommonService {

    constructor(vue) {
        super(vue);
        this._key = 1;
        this._url = "";
        this._show = false;
        this._userName = "";
        this._password = "";
        this._pageSize = 10;
        this._pageNumber = 1;
        this._musicFlag = true;
        this._totalRecord = 30;
        this._files = [];
        this._audios = Array.of({
            lrc: "",
            artist: "本兮",
            name: "让寂寞别走",
            cover: "https://m.yongkj.cn/audio_default.png",
            url: "https://file.yongkj.cn/fileSystem/admin/Music/%E6%9C%AC%E5%85%AE%20-%20%E8%AE%A9%E5%AF%82%E5%AF%9E%E5%88%AB%E8%B5%B0%20%20mqms2%20.mp3",
        }, {

            lrc: "",
            artist: "本兮&单小源",
            name: "你在看孤独的风景",
            cover: "https://m.yongkj.cn/audio_default.png",
            url: "https://file.yongkj.cn/fileSystem/admin/Music/%E6%9C%AC%E5%85%AE%26%E5%8D%95%E5%B0%8F%E6%BA%90%20-%20%E4%BD%A0%E5%9C%A8%E7%9C%8B%E5%AD%A4%E7%8B%AC%E7%9A%84%E9%A3%8E%E6%99%AF%20%20mqms2%20.mp3",
        });
    }

    initData() {
        GenUtil.timer(() => this.getRef("aplayer").play(), 300);
        this.getService(WallpaperService).on("test", msg => {
            this.info(msg);
            LogUtil.loggerLine(Log.of("DemoTestService", "testEvent", "msg", msg));
        });
        // LogUtil.loggerLine(Log.of("DemoTestService", "initData", "message", this.vue.$message));
        // LogUtil.loggerLine(Log.of("DemoTestService", "initData", "excelFile", this.excelFile));
        LogUtil.loggerLine(Log.of("DemoTestService", "initData", "vue", this.vue));
        LogUtil.loggerLine(Log.of("DemoTestService", "initData", "WallpaperMiniService", this.getService(WallpaperService)));
    }

    changeFiles(file, fileList) {
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "file", file));
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "fileList", fileList));
    }

    uploadFiles() {

    }

    reset() {

    }

    register() {

    }

    login() {

    }

    connect() {

    }

    disconnect() {

    }

    handleButtonClick() {
        this._show = true;
        this._userName = "Hello world!";
        this._password = "Hello world!";
        // this.service.userName = "Hello world!";
        // this.service.password = "Hello world!";
        this.getService(WallpaperService).emit("test", "Hello world！");
    }

    @autobind
    pageNumberChange(pageNumber) {
        LogUtil.loggerLine(Log.of("DemoTestService", "pageNumberChange", "pageNumber", pageNumber));
        LogUtil.loggerLine(Log.of("DemoTestService", "pageNumberChange", "this.service", this.service));
    }

    pageSizeChange(pageSize) {
        LogUtil.loggerLine(Log.of("DemoTestService", "pageSizeChange", "pageSize", pageSize));
    }

    get pageSize() {
        return this._pageSize;
    }

    get totalRecord() {
        return this._totalRecord;
    }

    get show() {
        return this._show;
    }

    get key() {
        return this._key;
    }

    get pageNumber() {
        return this._pageNumber;
    }

    set pageNumber(value) {
        this._pageNumber = value;
    }

    get audios() {
        return this._audios;
    }

    get musicFlag() {
        return this._musicFlag;
    }

    get userName() {
        return this._userName;
    }

    set userName(value) {
        this._userName = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get files() {
        return this._files;
    }

    set files(value) {
        this._files = value;
    }

    get url() {
        return this._url;
    }

    getClassName() {
        return Class.DemoTestService;
    }

    static get class() {
        return Class.DemoTestService;
    }

}