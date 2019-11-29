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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var deep_get_set_1 = __importDefault(require("deep-get-set"));
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var messages_1 = require("./messages");
var Snippet_1 = require("./models/Snippet");
var prompts_1 = require("./prompts");
exports.SNIPPET_REGEX = /[a-z]+-[A-Z]+.json/;
function readSnippet(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonObject, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_extra_1.readJSON(filePath, { encoding: 'utf8' })];
                case 1:
                    jsonObject = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    messages_1.criticalError('Invalid snippet file, ignoring it', filePath);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/, {
                        content: jsonObject,
                        contentString: JSON.stringify(jsonObject),
                        file: Snippet_1.createSnipetFile(filePath),
                    }];
            }
        });
    });
}
exports.readSnippet = readSnippet;
function findSnippetsInFolder(folder) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var files, err_2, snippets, files_1, files_1_1, fileName, isSnippet, snippet, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_extra_1.readdir(folder)];
                case 1:
                    files = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    messages_1.info('Couldnt find that folder, sorry!');
                    process.exit(0);
                    return [3 /*break*/, 3];
                case 3:
                    snippets = [];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 10, 11, 16]);
                    files_1 = __asyncValues(files);
                    _b.label = 5;
                case 5: return [4 /*yield*/, files_1.next()];
                case 6:
                    if (!(files_1_1 = _b.sent(), !files_1_1.done)) return [3 /*break*/, 9];
                    fileName = files_1_1.value;
                    isSnippet = exports.SNIPPET_REGEX.test(fileName);
                    if (!isSnippet) return [3 /*break*/, 8];
                    return [4 /*yield*/, readSnippet(path_1.join(folder, fileName))];
                case 7:
                    snippet = _b.sent();
                    if (snippet) {
                        snippets.push(snippet);
                    }
                    _b.label = 8;
                case 8: return [3 /*break*/, 5];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _b.trys.push([11, , 14, 15]);
                    if (!(files_1_1 && !files_1_1.done && (_a = files_1.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _a.call(files_1)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/, snippets];
            }
        });
    });
}
exports.findSnippetsInFolder = findSnippetsInFolder;
function walkSnippet(snippet, path) {
    return __awaiter(this, void 0, void 0, function () {
        var root, level, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = snippet.content;
                    level = deep_get_set_1.default(root, path);
                    _a.label = 1;
                case 1:
                    if (!(typeof level !== 'string')) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompts_1.promptChooseSubLevel(level, path.length !== 0)];
                case 2:
                    next = _a.sent();
                    if (next === prompts_1.back_value) {
                        path.pop();
                    }
                    else {
                        path.push(next);
                    }
                    if (next === prompts_1.new_value) {
                        path.pop();
                        return [2 /*return*/, {
                                createNew: true,
                                path: path,
                            }];
                    }
                    level = deep_get_set_1.default(root, path);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, {
                        createNew: false,
                        path: path,
                    }];
            }
        });
    });
}
exports.walkSnippet = walkSnippet;
function setDeepValue(snippetPath, content, path, newValue) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deep_get_set_1.default(content, path, newValue);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_extra_1.writeJson(snippetPath, content, {
                            spaces: '\t',
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    messages_1.criticalError('Could not write to file', snippetPath);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.setDeepValue = setDeepValue;
function editSnippet(snippets, path) {
    var snippets_1, snippets_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var snippet, snippetName, newValue, e_2_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, 9, 14]);
                    snippets_1 = __asyncValues(snippets);
                    _b.label = 1;
                case 1: return [4 /*yield*/, snippets_1.next()];
                case 2:
                    if (!(snippets_1_1 = _b.sent(), !snippets_1_1.done)) return [3 /*break*/, 7];
                    snippet = snippets_1_1.value;
                    snippetName = snippet.file.name;
                    return [4 /*yield*/, readSnippet(snippet.file.fullPath)];
                case 3:
                    // Just re-read it in case it changed
                    snippet = _b.sent();
                    return [4 /*yield*/, prompts_1.promptEditSnippetValue(snippetName, deep_get_set_1.default(snippet.content, path))];
                case 4:
                    newValue = _b.sent();
                    if (!newValue) {
                        messages_1.info('Aborted while editing');
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, setDeepValue(snippet.file.fullPath, snippet.content, path, newValue)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 1];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _b.trys.push([9, , 12, 13]);
                    if (!(snippets_1_1 && !snippets_1_1.done && (_a = snippets_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(snippets_1)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.editSnippet = editSnippet;
function newSnippet(snippets, type, path) {
    var snippets_2, snippets_2_1;
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var name, snippet, newValue, e_3_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prompts_1.promptAddSnippet(type)];
                case 1:
                    name = _b.sent();
                    if (path) {
                        path.push(name);
                    }
                    else {
                        path = [name];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 9, 10, 15]);
                    snippets_2 = __asyncValues(snippets);
                    _b.label = 3;
                case 3: return [4 /*yield*/, snippets_2.next()];
                case 4:
                    if (!(snippets_2_1 = _b.sent(), !snippets_2_1.done)) return [3 /*break*/, 8];
                    snippet = snippets_2_1.value;
                    if (!(type === 'collection')) return [3 /*break*/, 5];
                    setDeepValue(snippet.file.fullPath, snippet.content, path, {});
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, prompts_1.promptNewSnippetValue(snippet.file.name)];
                case 6:
                    newValue = _b.sent();
                    setDeepValue(snippet.file.fullPath, snippet.content, path, newValue);
                    _b.label = 7;
                case 7: return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_3_1 = _b.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _b.trys.push([10, , 13, 14]);
                    if (!(snippets_2_1 && !snippets_2_1.done && (_a = snippets_2.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _a.call(snippets_2)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15: return [2 /*return*/, path];
            }
        });
    });
}
exports.newSnippet = newSnippet;
