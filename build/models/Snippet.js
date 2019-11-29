"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var SnippetCache_1 = require("../SnippetCache");
function createSnipetFile(fullPath) {
    var splitPath = fullPath.split(path_1.sep);
    var snippetName = splitPath[splitPath.length - 3];
    return {
        fullPath: fullPath,
        basename: path_1.basename(fullPath),
        name: snippetName,
        trimmedSWPath: path_1.dirname(fullPath.replace(SnippetCache_1.shopwarePath, '...')),
    };
}
exports.createSnipetFile = createSnipetFile;
