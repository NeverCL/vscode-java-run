"use strict";
// tslint:disable:typedef
// tslint:disable:quotemark

// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import Compiler from './Compiler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let compiler = new Compiler(vscode);

    let disposable = vscode.commands.registerCommand("java.run", () => compiler.start());

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}