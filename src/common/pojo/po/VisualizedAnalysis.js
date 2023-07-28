import {GenUtil} from "@/common/util/GenUtil";

export class VisualizedAnalysis {

    static _EXCEL_DATA = GenUtil.arrayToMapList(require("@/common/resoureces/json/training-data.json"));

    static get EXCEL_DATA() {
        return this._EXCEL_DATA;
    }
}