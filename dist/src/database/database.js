"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
class FileDatabase {
    constructor(model) {
        var _a, _b;
        this.model = model;
        this.fileExtension = (_a = config_1.config === null || config_1.config === void 0 ? void 0 : config_1.config.fileExtension) !== null && _a !== void 0 ? _a : 'json';
        this.filePath = path_1.default.resolve(__dirname, `../../../databaseFiles/${(_b = this.model) === null || _b === void 0 ? void 0 : _b.name}.${this.fileExtension}`);
    }
    loadData() {
        try {
            const data = JSON.parse(fs_1.default.readFileSync(this.filePath, { encoding: 'utf8' }));
            return data !== null && data !== void 0 ? data : [];
        }
        catch (error) {
            console.log("something wrong happened when load data");
            return [];
        }
    }
    saveData(newData) {
        try {
            const jsonString = JSON.stringify(newData);
            fs_1.default.writeFileSync(this.filePath, jsonString, { encoding: 'utf8' });
        }
        catch (error) {
            console.log("something wrong happened when save data");
        }
    }
}
exports.FileDatabase = FileDatabase;
