import PathUtil from "path";
import fs from "fs";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";
import path from "path";

export class FileUtil {

    static appDir(isProd) {
        let launchName = require.main?.filename;
        if (typeof launchName === "undefined") {
            launchName = __filename;
        }
        let appDir = PathUtil.dirname(launchName);
        if (isProd) return appDir;
        return PathUtil.dirname(appDir);
    }

    static getAbsPath(isProd, ...names) {
        let path = this.appDir(isProd);
        for (let name of names) {
            path += PathUtil.sep + name;
        }
        return path;
    }

    static exist(fileName) {
        return fs.existsSync(fileName);
    }

    static readFile(fileName) {
        let fileContent = fs.readFileSync(fileName, 'binary');
        return Buffer.from(fileContent, 'binary').toString("base64");
    }

    static read(fileName) {
        return fs.readFileSync(fileName, "utf-8");
    }

    static write(fileName, content) {
        fs.writeFileSync(fileName, content);
    }

    static list(fileName) {
        try {
            fs.accessSync(fileName, fs.constants.R_OK);
            return fs.readdirSync(fileName);
        } catch (e) {
            LogUtil.loggerLine(Log.of("FileUtil", "list", "e", e));
            return [];
        }
    }

    static isFolder(fileName) {
        return fs.statSync(fileName).isDirectory();
    }

    static modDate(fileName) {
        return fs.statSync(fileName).mtime;
    }

    static size(fileName) {
        if (this.isFolder(fileName)) {
            return this.sizeFolder(fileName);
        }
        return fs.statSync(fileName).size;
    }

    static mkdir(fileName) {
        if (!this.exist(fileName)) {
            fs.mkdirSync(fileName, {recursive: true})
        }
    }

    static copy(srcFileName, desFileName) {
        if (this.isFolder(srcFileName)) {
            this.mkdir(desFileName);
            this.copyFolder(srcFileName, desFileName);
        } else {
            fs.copyFileSync(srcFileName, desFileName);
        }
    }

    static copyFolder(srcFolderName, desFolderName) {
        let files = this.list(srcFolderName);
        for (let file of files) {
            let srcNewFileName = srcFolderName + path.sep + file;
            let desNewFileName = desFolderName + path.sep + file;
            if (this.isFolder(srcNewFileName)) {
                this.mkdir(desNewFileName);
                this.copyFolder(srcNewFileName, desNewFileName);
            } else {
                this.copy(srcNewFileName, desNewFileName);
            }
        }
    }

    static sizeFolder(fileName) {
        let folderSize = 0;
        let files = this.list(fileName);
        for (let file of files) {
            let tempFileName = fileName + path.sep + file;
            if (this.isFolder(tempFileName)) {
                folderSize += this.sizeFolder(tempFileName);
            } else {
                folderSize += this.size(tempFileName);
            }
        }
        return folderSize;
    }

    static modFile(path, regStr, value, isAll) {
        this.modifyFile(path, regStr, () => value, isAll);
    }

    static modifyFile(path, regStr, valueFunc, isAll) {
        let regex = isAll ? new RegExp(regStr, "g") : new RegExp(regStr);
        let content = this.read(path).replace(regex, (allStr,  matchStr) => valueFunc(matchStr));
        this.write(path, content);
    }

    static modContent(path, regStr, value, isAll) {
        this.modify(path, regStr, () => value, isAll);
    }

    static modify(path, regStr, valueFunc, isAll) {
        let content = this.read(path);
        let contentArray = content.includes("\r\n") ?
            content.split("\r\n") : content.split("\n");
        let regex = new RegExp(regStr);
        for (let line of contentArray) {
            if (!regex.test(line)) continue;
            let lstMatch = line.match(regex);
            if (lstMatch == null) continue;
            let newLine = line.replace(lstMatch[1], valueFunc(lstMatch[1]));
            content = content.replace(line, newLine);
            if (typeof isAll === "undefined" || !isAll) {
                break;
            }
        }
        this.write(path, content);
    }

}