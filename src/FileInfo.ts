/**
 * FileInfo
 */

// tslint:disable:typedef
export default class FileInfo {
    // 文件夹名 + 文件名
    fullFileName: string;
    // 文件夹名
    folderPath: string;
    // 文件名
    fileName: string;
    // 类名(去除.java)
    className: string;
    // 包名
    packageName: string;

    constructor(document) {
        this.init(document.fileName, document.getText());
    }

    // 初始化文件
    init(fullFileName, text) {
        let isUnixLike: boolean = fullFileName.startsWith("/");// 是否unix系统
        let fileNameIndex = isUnixLike ? fullFileName.lastIndexOf("/") : fullFileName.lastIndexOf("\\");
        let fileName = fullFileName.substring(fileNameIndex + 1);
        let folderPath = fullFileName.substring(0, fileNameIndex);// c://tmp
        let className = fileName.substring(0, fileName.indexOf(".java"));

        let rst = /package (.+)?;/.exec(text);
        if (rst && rst.length === 2) {
            this.packageName = rst[1];
        }

        this.fullFileName = fullFileName;
        this.folderPath = folderPath;
        this.fileName = fileName;
        this.className = className;
    }

}