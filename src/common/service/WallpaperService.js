import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class WallpaperService extends CommonService {

    constructor(vue) {
        super(vue);
    }

    initData() {
        this.screenResizeWatch();
    }

    getBgImgStyle(bgImg) {
        return {
            backgroundImage: 'url(' + bgImg + ')'
        };
    }

    getScrollbarHeightStyle() {
        let screenHeight = document.documentElement.clientHeight;
        return {
            height: screenHeight + "px",
        };
    }

    getMainWidthStyle() {
        let screenWidth = document.documentElement.clientWidth;
        return {
            width: screenWidth + "px"
        };
    }

    getClassName() {
        return Class.WallpaperService;
    }

    static get class() {
        return Class.WallpaperService;
    }

}