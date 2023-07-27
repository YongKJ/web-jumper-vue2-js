
export class GenUtil {

    static timer(func, time) {
        setTimeout(func, time);
    }

    static sleep(waitTimeInMs) {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
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