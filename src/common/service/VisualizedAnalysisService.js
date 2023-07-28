import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import {VisualizedAnalysis} from "@/common/pojo/po/VisualizedAnalysis";
import {GenUtil} from "@/common/util/GenUtil";
import autobind from "autobind-decorator";
import Plotly from "plotly.js-dist-min";
import {ExcelUtil} from "@/common/util/ExcelUtil";
import {FreezeExcelService} from "@/common/service/FreezeExcelService";
import {WallpaperPlusImage} from "@/common/pojo/po/WallpaperPlusImage";

export class VisualizedAnalysisService extends CommonService {

    constructor(vue) {
        super(vue);
        this._url = "";
        this._xAxis = "";
        this.file = null;
        this.plotly = null;
        this.bgImgIndex = 0;
        this._sheetName = "";
        this._percentage = 25;
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this._layoutTitle = "";
        this._yAxis = [];
        this._fields = [];
        this._files = [];
        this._sheetNames = [];
        this._bgImg = WallpaperPlusImage.BACKGROUND;
        this.excelData = VisualizedAnalysis.EXCEL_DATA;
        this.tempExcelData = [];
        this.mapSheets = new Map();
        this._colors = Array.of(
            {color: '#5cb87a', percentage: 26},
            {color: '#e6a23c', percentage: 51},
            {color: '#1989fa', percentage: 76},
            {color: '#f56c6c', percentage: 100}
        );
        this.coords = Array.of(
            {width: 800, height: 600},
            {width: 1100, height: 700},
            {width: 1500, height: 800},
            {width: 1920, height: 947},
        );
        this.coord = this.coords[0];
        this.bgImgs = Array.of(
            WallpaperPlusImage.BACKGROUND,
            WallpaperPlusImage.BACKGROUND_TWO,
            WallpaperPlusImage.BACKGROUND_THREE,
            WallpaperPlusImage.BACKGROUND_FOUR,
            WallpaperPlusImage.BACKGROUND_FIVE,
            WallpaperPlusImage.BACKGROUND_SIX,
            WallpaperPlusImage.BACKGROUND_SEVEN,
            WallpaperPlusImage.BACKGROUND_EIGHT,
            WallpaperPlusImage.BACKGROUND_NINE,
            WallpaperPlusImage.BACKGROUND_TEN,
            WallpaperPlusImage.BACKGROUND_ELEVEN,
            WallpaperPlusImage.BACKGROUND_TWELVE,
            WallpaperPlusImage.BACKGROUND_THIRTEEN,
            WallpaperPlusImage.BACKGROUND_FOURTEEN,
            WallpaperPlusImage.BACKGROUND_FIFTEEN,
        );
    }

    changeBgImgIndex() {
        this.bgImgIndex += 1;
        if (this.bgImgIndex > 14) {
            this.bgImgIndex = 0;
        }
        this._bgImg = this.bgImgs[this.bgImgIndex];
    }

    @autobind
    async changeFiles(file, fileList){
        if (!(file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ||
            file.name.endsWith(".csv") || file.name.endsWith(".json"))) {
            this.warning("数据文件格式仅支持 XLSX、XLS、CSV、JSON！");
            fileList.pop();
            return;
        }
        if (fileList.length > 1) {
            this._files.pop();
            this._files.push(file);
        }
        this.file = file;
        this.resetVisualizedAnalysis();
        this._fields = [];
        this.mapSheets = await ExcelUtil.toMapSheet(file.raw);
        this._sheetNames = GenUtil.getKeys(this.mapSheets);
        if (this._sheetNames.length === 1) {
            this._sheetName = this._sheetNames[0];
            this.tempExcelData = this.mapSheets.get(this._sheetName);
            if (this.tempExcelData.length > 0) {
                this._fields = GenUtil.getKeys(this.tempExcelData[0]);
            }
        }
    }

    isInputError() {
        if (this.file == null) {
            this.warning("请先选择本地数据文件！");
            return true;
        }
        if (this._xAxis.length === 0) {
            this.warning("请选择 X 轴方向数据！");
            return true;
        }
        if (this._yAxis.length === 0) {
            this.warning("请选择 Y 轴方向数据！");
            return true;
        }
        return false;
    }

    async visualizedAnalysis(isDefault) {
        if (this.plotly !== null) {
            let flag = this.file == null;
            this.updateTrace(flag).then();
            return;
        }
        if (!isDefault && this.isInputError()) return;
        let config = VisualizedAnalysisService.getConfig();
        let traces = this.getTracesData(isDefault);
        let layout = this.getLayout();
        this.plotly = await Plotly.newPlot("target", traces, layout, config);
    }

    async updateTrace(isDefault) {
        let layout = this.getLayout();
        let traces = this.getTracesData(isDefault);
        let config = VisualizedAnalysisService.getConfig();
        this.plotly = await Plotly.react("target", traces, layout, config);
    }

    reLayout() {
        Plotly.relayout("target", this.getLayout()).then();
    }

    static getConfig() {
        let config = {};
        config.modeBarButtonsToAdd = ["toggleSpikelines"];
        return config;
    }

    getLayout() {
        let layout ={};
        layout.xaxis = {};
        layout.yaxis = {};
        layout.hovermode = "x";
        layout.width = this.coord.width;
        layout.height = this.coord.height;
        layout.showlegend = this._yAxis.length > 1;
        layout.yaxis.title = this._yAxis.length === 1 ? this._yAxis[0] :
            (this._yAxisTitle.length > 0 ? this._yAxisTitle : "training data");
        layout.xaxis.title = this._xAxisTitle.length > 1 ? this._xAxisTitle : this._xAxis;
        layout.title = this._layoutTitle.length > 0 ? this._layoutTitle : "visual analysis of training data";
        return layout;
    }

    getTracesData(isDefault) {
        let traces = [];
        let xData = (isDefault ? this.excelData : this.tempExcelData)
            .map(data => data.get(this.xAxis));
        let flag = !(typeof isDefault === "undefined" || !isDefault);
        for (let yKey of this._yAxis) {
            traces.push(this.getTraceData(flag, yKey, xData));
        }
        return traces;
    }

    getTraceData(isDefault, yKey, xData) {
        let trace = {};
        let yData = (isDefault ? this.excelData : this.tempExcelData)
            .map(data => data.get(yKey));
        trace.showlegend = this._yAxis.length > 1;
        trace.type = "scatter";
        trace.mode = "lines";
        trace.xaxis = "x";
        trace.yaxis = "y";
        trace.name = yKey;
        trace.x = xData;
        trace.y = yData;
        return trace;
    }

    @autobind
    removeFile(file, fileList) {
        this.mapSheets = new Map();
        this.tempExcelData = [];
        this._sheetNames = [];
        this._fields = [];
        this.resetVisualizedAnalysis();
    }

    uploadFiles(){

    }

    resetVisualizedAnalysis() {
        if (this.plotly != null) Plotly.purge("target");
        this._yAxis = [];
        this.coord = this.coords[0];
        this._percentage = 25;
        this._layoutTitle = "";
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this._sheetName = "";
        this.plotly = null;
        this._xAxis = "";
    }

    switchSheetData() {
        if (this.plotly != null) Plotly.purge("target");
        this._yAxis = [];
        this.coord = this.coords[0];
        this._percentage = 25;
        this._layoutTitle = "";
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this.plotly = null;
        this._xAxis = "";
    }

    async exportExcelOperate() {
        if (this.mapSheets.size === 0) {
            this.warning("请先选择本地数据文件！");
            return;
        }
        this.getService(FreezeExcelService).freezeExcelVisible = true;
    }

    async exportExcelData() {
        let sheetNames = this.getService(FreezeExcelService).names;
        for (let sheetName of sheetNames) {
            this.tempExcelData = this.mapSheets.get(sheetName);
            let lstKey = GenUtil.getKeys(this.tempExcelData[0]);
            let lstHeader = [];
            for (let key of lstKey) {
                lstHeader.push(Array.of(key));
            }
            let rowIndex = lstHeader[0].length;
            ExcelUtil.writeHeader(lstHeader);
            for (let i = 0; i < this.tempExcelData.length; i++, rowIndex++) {
                for (let j = 0, colIndex = 0; j < lstKey.length; j++, colIndex++) {
                    ExcelUtil.writeCellData(rowIndex, colIndex, this.tempExcelData[i].get(lstKey[j]));
                }
            }
            ExcelUtil.packSheet(sheetName,
                this.getService(FreezeExcelService).dataRow,
                this.getService(FreezeExcelService).dataCol
            );
        }
        let buffer = await ExcelUtil.writeBuffer();
        let url = URL.createObjectURL(new Blob([buffer]));
        let index = this.file?.name.lastIndexOf(".");
        let name = this.file?.name.substring(0, index);
        GenUtil.createLinkTag(url, name + ".xlsx");
    }

    showDefaultData() {
        this.resetVisualizedAnalysis();
        this._layoutTitle = "visual analysis of training data";
        this._fields = GenUtil.getKeys(this.excelData[0]);
        this._yAxisTitle = "training data";
        this._yAxis = Array.of(
            "train_loss", "test_loss",
            "train_acc", "test_acc"
        );
        this.coord = this.coords[0];
        this._xAxisTitle = "epoch";
        this._percentage = 25;
        this._xAxis = "epoch";
        this.visualizedAnalysis(true).then();
    }

    visualIncrease() {
        if (this.plotly == null) {
            if (!this.isInputError()) {
                this.warning("请点击先可视化按钮！");
            }
            return;
        }
        if (this._percentage === 100) return;
        this._percentage += 25;
        let num = this._percentage / 25;
        this.coord = this.coords[num - 1];
        this.reLayout();
    }

    visualDecrease() {
        if (this.plotly == null) {
            if (!this.isInputError()) {
                this.warning("请点击先可视化按钮！");
            }
            return;
        }
        if (this._percentage === 25) return;
        this._percentage -= 25;
        let num = this._percentage / 25;
        this.coord = this.coords[num - 1];
        this.reLayout();
    }

    get bgImg() {
        return this._bgImg;
    }

    set bgImg(value) {
        this._bgImg = value;
    }

    get sheetName() {
        return this._sheetName;
    }

    set sheetName(value) {
        this._sheetName = value;
        this.switchSheetData();
        this.tempExcelData = this.mapSheets.get(this._sheetName);
        if (this.tempExcelData.length > 0) {
            this._fields = GenUtil.getKeys(this.tempExcelData[0]);
        }
    }

    get sheetNames() {
        return this._sheetNames;
    }

    get colors() {
        return this._colors;
    }

    get percentage() {
        return this._percentage;
    }

    set percentage(value) {
        this._percentage = value;
    }

    get layoutTitle() {
        return this._layoutTitle;
    }

    set layoutTitle(value) {
        this._layoutTitle = value;
    }

    get xAxisTitle() {
        return this._xAxisTitle;
    }

    set xAxisTitle(value) {
        this._xAxisTitle = value;
    }

    get yAxisTitle() {
        return this._yAxisTitle;
    }

    set yAxisTitle(value) {
        this._yAxisTitle = value;
    }

    get yAxis() {
        return this._yAxis;
    }

    set yAxis(value) {
        this._yAxis = value;
    }

    get xAxis() {
        return this._xAxis;
    }

    set xAxis(value) {
        this._xAxis = value;
    }

    get url() {
        return this._url;
    }

    get files() {
        return this._files;
    }

    set files(value) {
        this._files = value;
    }

    get fields() {
        return this._fields;
    }

    getClassName() {
        return Class.VisualizedAnalysisService;
    }

    static get class() {
        return Class.VisualizedAnalysisService;
    }

}