import {VisualizedAnalysisService} from "@/common/service/VisualizedAnalysisService";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class FreezeExcelService extends CommonService {

    constructor(vue) {
        super(vue);
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = false;
        this._names = [];
        this._sheetNames = [];
    }

    async freezeExcelChange() {
        await this.getService(VisualizedAnalysisService).exportExcelData();
        this.dialogCloseChange();
    }

    dialogCancelChange() {
        this.info("取消导出！");
        this.dialogCloseChange();
    }

    dialogCloseChange(doneFunc) {
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = false;
        if (typeof doneFunc !== "undefined") doneFunc();
    }

    get freezeExcelVisible() {
        return this._freezeExcelVisible;
    }

    get dataRow() {
        return this._dataRow;
    }

    set dataRow(value) {
        this._dataRow = value;
    }

    get dataCol(){
        return this._dataCol;
    }

    set dataCol(value) {
        this._dataCol = value;
    }

    set freezeExcelVisible(value) {
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = value;
        this._names = [];
        this._sheetNames = this.getService(VisualizedAnalysisService).sheetNames;
        if (this._sheetNames.length === 1) this._names = Array.of(this._sheetNames[0]);
    }

    get sheetNames() {
        return this._sheetNames;
    }

    get names() {
        return this._names;
    }

    set names(value) {
        this._names = value;
    }

    getClassName() {
        return Class.FreezeExcelService;
    }

    static get class() {
        return Class.FreezeExcelService;
    }

}