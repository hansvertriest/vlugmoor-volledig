"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const morgan_1 = __importDefault(require("morgan"));
class MorganMiddleware {
    static load(app) {
        const morganMiddleware = morgan_1.default((tokens, req, res) => {
            return [
                chalk_1.default
                    .hex('#ffffff')
                    .bold(`${moment_1.default(tokens.date(req, res)).format('YYYY-MM-DD hh:mm:ss')}`),
                chalk_1.default.hex('#34ace0').bold(`[${tokens.method(req, res)}]`),
                ':\t',
                chalk_1.default.hex('#ff5252').bold(`[${tokens.url(req, res)}]`),
                chalk_1.default.hex('#f78fb3').bold(`[${tokens.status(req, res)}]`),
                chalk_1.default.hex('#fffff').bold(`${tokens['response-time'](req, res)}ms`),
                chalk_1.default.hex('#fffff').bold(tokens['remote-addr'](req, res)),
                ''
            ].join(' ');
        });
        app.use(morganMiddleware);
    }
}
exports.default = MorganMiddleware;
//# sourceMappingURL=MorganMiddleware.js.map