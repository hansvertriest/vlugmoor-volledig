"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = exports.DataController = exports.MetaDataController = exports.UserController = exports.HelloController = void 0;
const HelloController_1 = __importDefault(require("./HelloController"));
exports.HelloController = HelloController_1.default;
const UserController_1 = __importDefault(require("./UserController"));
exports.UserController = UserController_1.default;
const FileController_1 = __importDefault(require("./FileController"));
exports.FileController = FileController_1.default;
const MetaDataController_1 = __importDefault(require("./MetaDataController"));
Object.defineProperty(exports, "MetaDataController", { enumerable: true, get: function () { return MetaDataController_1.default; } });
const DataController_1 = __importDefault(require("./DataController"));
Object.defineProperty(exports, "DataController", { enumerable: true, get: function () { return DataController_1.default; } });
//# sourceMappingURL=index.js.map