"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extracImageName = void 0;
const url_1 = __importDefault(require("url"));
const extracImageName = (imageSource) => {
    var _a;
    const parsedUrl = url_1.default.parse(imageSource);
    const path = (_a = parsedUrl.pathname) === null || _a === void 0 ? void 0 : _a.slice(1);
    return path;
};
exports.extracImageName = extracImageName;
