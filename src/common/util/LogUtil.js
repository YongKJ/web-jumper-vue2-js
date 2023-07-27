import {Global} from "@/common/config/Global";

export class LogUtil {

    static enable = Global.LOG_ENABLE;

    static loggerLine(log) {
        if (this.enable) {
            console.log("[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": ", log.value);
        }
    }

    static logger(log) {
        if (this.enable) {
            console.log("\n[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": ", log.value);
        }
    }

}