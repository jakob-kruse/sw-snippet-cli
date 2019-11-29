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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var os_1 = require("os");
var path_1 = require("path");
var walkdir_1 = require("walkdir");
var Cache_1 = __importDefault(require("./Cache"));
var messages_1 = require("./messages");
var Snippet_1 = require("./models/Snippet");
var prompts_1 = require("./prompts");
var snippet_manager_1 = require("./snippet_manager");
exports.cachePath = path_1.join(os_1.homedir(), '.config', 'snippet-cli.json');
var cache;
function findSnippets(shopwarePath) {
    return __awaiter(this, void 0, void 0, function () {
        var paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.ensureDir(shopwarePath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, walkdir_1.async(shopwarePath)];
                case 2:
                    paths = (_a.sent())
                        .filter(function (path) { return snippet_manager_1.SNIPPET_REGEX.test(path_1.basename(path)); })
                        .map(function (path) { return Snippet_1.createSnipetFile(path); });
                    return [2 /*return*/, paths];
            }
        });
    });
}
function initCache(swPath) {
    return __awaiter(this, void 0, void 0, function () {
        var snippets, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fs_extra_1.pathExists(exports.cachePath)];
                case 1:
                    if (!!(_b.sent())) return [3 /*break*/, 8];
                    return [4 /*yield*/, fs_extra_1.writeJson(exports.cachePath, Cache_1.default, {
                            spaces: 2,
                        })];
                case 2:
                    _b.sent();
                    cache = Cache_1.default;
                    if (!!swPath) return [3 /*break*/, 4];
                    _a = path_1.resolve;
                    return [4 /*yield*/, prompts_1.promptShopwarePath()];
                case 3:
                    exports.shopwarePath = _a.apply(void 0, [_b.sent()]);
                    cache.shopwarePath = exports.shopwarePath;
                    if (!exports.shopwarePath) {
                        messages_1.info('Nothing? Ok, See you!');
                        process.exit(0);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    exports.shopwarePath = swPath;
                    _b.label = 5;
                case 5:
                    messages_1.info('Gathering snippet files. This might take a while!');
                    return [4 /*yield*/, findSnippets(exports.shopwarePath)];
                case 6:
                    snippets = _b.sent();
                    cache.paths = snippets;
                    return [4 /*yield*/, fs_extra_1.writeJson(exports.cachePath, cache)];
                case 7:
                    _b.sent();
                    messages_1.amountInfo('Found', snippets.length, 'Snippet Files and cached them');
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, fs_extra_1.readJSON(exports.cachePath)];
                case 9:
                    cache = _b.sent();
                    snippets = cache.paths;
                    messages_1.amountInfo('Found', snippets.length, 'Snippet Files in the cache');
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.initCache = initCache;
function clearCache() {
    return __awaiter(this, void 0, void 0, function () {
        var _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_extra_1.remove(exports.cachePath)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.clearCache = clearCache;
function getSnippetFiles() {
    return cache.paths;
}
exports.getSnippetFiles = getSnippetFiles;
