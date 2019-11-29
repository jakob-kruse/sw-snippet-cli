#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var messages_1 = require("./messages");
var prompts_1 = require("./prompts");
var SnippetCache_1 = require("./SnippetCache");
var snippet_manager_1 = require("./snippet_manager");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var snippetFiles, selectedSnippetPath, snippetDir, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (process.argv[2] === 'cache') {
                    SnippetCache_1.clearCache();
                    messages_1.info('Cleared Cache');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, SnippetCache_1.initCache(process.argv[2])];
            case 1:
                _b.sent();
                snippetFiles = SnippetCache_1.getSnippetFiles();
                return [4 /*yield*/, prompts_1.promptSnippetAutoComplete(snippetFiles)];
            case 2:
                selectedSnippetPath = _b.sent();
                snippetDir = path_1.dirname(snippetFiles.find(function (snippet) { return (snippet.fullPath = selectedSnippetPath); })
                    .fullPath);
                _a = modify;
                return [4 /*yield*/, snippet_manager_1.findSnippetsInFolder(snippetDir)];
            case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); })();
function modify(snippets, startPath) {
    if (startPath === void 0) { startPath = []; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, createNew, path, type, newPath, _continue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, snippet_manager_1.walkSnippet(snippets[0], startPath)];
                case 1:
                    _a = _b.sent(), createNew = _a.createNew, path = _a.path;
                    if (!createNew) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompts_1.newType()];
                case 2:
                    type = _b.sent();
                    if (!(type === prompts_1.back_value)) return [3 /*break*/, 4];
                    return [4 /*yield*/, modify(snippets, startPath)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (!type) {
                        messages_1.info('Aborted while walking snippet');
                        process.exit(0);
                    }
                    return [4 /*yield*/, snippet_manager_1.newSnippet(snippets, type, path)];
                case 5:
                    newPath = _b.sent();
                    return [4 /*yield*/, prompts_1.promptShouldContinue()];
                case 6:
                    _continue = _b.sent();
                    if (!_continue) return [3 /*break*/, 8];
                    return [4 /*yield*/, modify(snippets, newPath)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [2 /*return*/];
                case 9: return [4 /*yield*/, snippet_manager_1.editSnippet(snippets, path)];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
