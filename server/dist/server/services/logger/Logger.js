"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger_types_1 = require("./logger.types");
class Logger {
    constructor() {
        const { align, combine, colorize, timestamp, printf } = winston_1.format;
        this.logger = winston_1.createLogger({
            format: combine(colorize(), timestamp(), align(), printf(info => {
                const { timestamp, level, message, ...args } = info;
                const ts = timestamp.slice(0, 19).replace('T', ' ');
                return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
            })),
            transports: [
                new winston_1.transports.Console(),
                new winston_1.transports.File({ filename: './error.log', level: 'error' }),
                new winston_1.transports.File({ filename: './combined.log' })
            ],
            exitOnError: false
        });
    }
    log(level, msg, obj) {
        this.logger.log(level, msg, {
            object: obj,
            timestamp: new Date().toISOString()
        });
    }
    error(msg, obj) {
        this.log(logger_types_1.LoggLevel.error, msg, obj);
    }
    info(msg, obj) {
        this.log(logger_types_1.LoggLevel.info, msg, obj);
    }
    warning(msg, obj) {
        this.log(logger_types_1.LoggLevel.warning, msg, obj);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map