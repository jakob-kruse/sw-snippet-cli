"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
function criticalError(message, value) {
    paddedWithNewLines(chalk_1.default.red(message) + ": " + chalk_1.default.redBright(value));
}
exports.criticalError = criticalError;
function info(message, value) {
    if (!value) {
        console.log(chalk_1.default.greenBright(message));
        return;
    }
    console.log(chalk_1.default.white(message) + ": " + chalk_1.default.greenBright(value));
}
exports.info = info;
function amountInfo(before, amount, after) {
    console.log(chalk_1.default.white(before) + " " + chalk_1.default.greenBright(amount) + " " + chalk_1.default.white(after) + " ");
}
exports.amountInfo = amountInfo;
function newline(amount) {
    if (amount === void 0) { amount = 1; }
    for (var i = 0; i <= amount; i++) {
        console.log('');
    }
}
exports.newline = newline;
function paddedWithNewLines(content, top, bottom) {
    if (top === void 0) { top = 1; }
    if (bottom === void 0) { bottom = 1; }
    newline(top);
    console.log(content);
    newline(bottom);
}
exports.paddedWithNewLines = paddedWithNewLines;
