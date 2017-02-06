/**
 * Java 编译器
 * 
 * @author Never、C
 * @version 1.0
 */

export default class Compiler {
    private vscode;
    private outputChannel;
    private statusBar;

    constructor(_vscode) {
        this.vscode = _vscode;
        this.init();
    }

    //初始化
    private init() {
        this.outputChannel = this.vscode.window.createOutputChannel("Java Run");
        this.outputChannel.appendLine("\"Java.Run\" 已启动!\n 快捷键 alt+b 编译并运行");
        this.outputChannel.show();
        let StatusBarAlignment = this.vscode.StatusBarAlignment;;
        this.statusBar = this.vscode.window.createStatusBarItem(StatusBarAlignment.Left);
        this.statusBar.show();
    }

    //启动
    start() {
        this.prebuild(this.vscode.window.activeTextEditor);
    }

    private info(info, isOutput = false) {
        if (isOutput)
            this.outputChannel.appendLine(info);
        else
            this.statusBar.text = info;
    }

    private prebuild(editor) {
        this.outputChannel.clear();
        let fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return;
        }

        if (!fullFileName.endsWith(".java")) {// 限定java文件
            return;
        }

        if (editor.document.isDirty) {// 自动保存
            this.info('文件未保存,自动保存...');
            editor.document.save();
        }
        this.build(fullFileName);
    }

    private build(fullFileName) {
        let exec = require("child_process").exec;
        let cmd = "javac " + fullFileName;
        this.info('正在生成...');
        let iconv = require('iconv-lite');// 中文转码处理
        let encoding = 'cp936';// 类似gb2312
        let binaryEncoding = 'binary';
        exec(cmd, { encoding: binaryEncoding }, (err, stdout, stderr) => {
            if (stderr) {
                this.info('生成失败!')
                this.info(iconv.decode(new Buffer(stderr, binaryEncoding), encoding), true);
                return;
            } else {
                this.info('生成成功!')
                this.run(exec, fullFileName);
            }
        });
    }

    private run(exec, fullFileName) {
        let isUnixLike = fullFileName.startsWith("/");
        let fileNameIndex = isUnixLike ? fullFileName.lastIndexOf("/") : fullFileName.lastIndexOf("\\");
        let fileName = fullFileName.substring(fileNameIndex + 1);
        let folderPath = fullFileName.substring(0, fileNameIndex);// c://tmp
        let className = fileName.substring(0, fileName.indexOf(".java"));
        let cmd = "java -cp " + folderPath + " " + className;
        exec(cmd, (error, stdout, stderr) => {
            if (stderr) {
                this.info(stderr, true);
            } else {
                this.info(stdout, true);
            }
        });
    }

    dispose() {  //实现dispose方法
        this.statusBar.dispose();
    }
}