import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class TestService extends CommonService {

    constructor(vue) {
        super(vue);
    }

    getClassName() {
        return Class.TestService;
    }

    static class() {
        return Class.TestService;
    }

}