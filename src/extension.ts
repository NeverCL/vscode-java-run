"use strict";
// tslint:disable:typedef
// tslint:disable:quotemark

// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let outputChannel = vscode.window.createOutputChannel("Java Run");
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine("\"Java.Run\" 已启动!\n 快捷键 alt+b 编译并运行");

    let disposable = vscode.commands.registerCommand("java.run", () => {
        outputChannel.clear();
        let editor = vscode.window.activeTextEditor;
        let fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return;
        }

        // 限定java文件
        if (!fullFileName.endsWith(".java")) {
            return;
        }

        // 自动保存
        if (editor.document.isDirty) {
            outputChannel.appendLine("文件未保存,自动保存...");
            editor.document.save();
        }

        let exec = require("child_process").exec;
        let cmd = "javac " + fullFileName;
        outputChannel.appendLine("正在执行1: " + cmd);

        let runFunc = () => {
            let isUnixLike = fullFileName.startsWith("/");
            let fileNameIndex = isUnixLike ? fullFileName.lastIndexOf("/") : fullFileName.lastIndexOf("\\");
            let fileName = fullFileName.substring(fileNameIndex + 1);
            let folderPath = fullFileName.substring(0, fileNameIndex);// c://tmp
            let className = fileName.substring(0, fileName.indexOf(".java"));
            cmd = "java -cp " + folderPath + " " + className;
            outputChannel.appendLine("正在执行2: " + cmd);
            exec(cmd, function (error, stdout, stderr) {
                if (stderr) {
                    outputChannel.appendLine(stderr);
                } else {
                    outputChannel.appendLine("输出结果:");
                    outputChannel.appendLine(stdout);
                    vscode.window.showInformationMessage("Run Java:" + stdout);
                }
            });
        }

        let iconv = require('iconv-lite');// 中文转码处理
        let encoding = 'cp936';// 类似gb2312
        let binaryEncoding = 'binary';

        exec(cmd, { encoding: binaryEncoding }, function (err, stdout, stderr) {
             if (stderr) {
                outputChannel.appendLine(iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
                return;
            } else {
                outputChannel.appendLine("生成成功!");
                runFunc();// 运行java程序
            }
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}