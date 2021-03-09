"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerMiddleware = exports.MorganMiddleware = exports.GlobalMiddleware = void 0;
const GlobalMiddleware_1 = __importDefault(require("./GlobalMiddleware"));
exports.GlobalMiddleware = GlobalMiddleware_1.default;
const logger_1 = __importDefault(require("./logger"));
exports.MorganMiddleware = logger_1.default;
const swagger_1 = __importDefault(require("./swagger"));
Object.defineProperty(exports, "SwaggerMiddleware", { enumerable: true, get: function () { return swagger_1.default; } });
//# sourceMappingURL=index.js.map