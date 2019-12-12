"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const triple_beam_1 = require("triple-beam");
const winston = require("winston");
const util_1 = require("util");
class Logger {
    constructor(loggerName) {
        this.winstonLogger = winston.createLogger({
            levels: {
                trace: 6,
                debug: 5,
                info: 4,
                warn: 3,
                error: 2,
                severe: 1,
                none: 0,
            },
            level: process.env.LOG_LEVEL || 'trace',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase().padStart(6)} [${loggerName}] ${info.message} ${printMeta(info[triple_beam_1.SPLAT])}`)),
                }),
            ],
        });
    }
    get level() {
        return this.winstonLogger.level;
    }
    log(level, message, ...meta) {
        this.winstonLogger.log(level, message, ...meta);
    }
    trace(message, ...meta) {
        this.winstonLogger.log('trace', message, ...meta);
    }
    debug(message, ...meta) {
        this.winstonLogger.log('debug', message, ...meta);
    }
    info(message, ...meta) {
        this.winstonLogger.log('info', message, ...meta);
    }
    warn(message, ...meta) {
        this.winstonLogger.log('warn', message, ...meta);
    }
    error(message, ...meta) {
        this.winstonLogger.log('error', message, ...meta);
    }
    severe(message, ...meta) {
        this.winstonLogger.log('severe', message, ...meta);
    }
}
exports.default = Logger;
function printMeta(meta) {
    if (!meta) {
        return '';
    }
    if (Array.isArray(meta)) {
        return meta.map((o) => getErrorMessage(o)).join(' ');
    }
    return getErrorMessage(meta);
}
function getErrorMessage(obj) {
    return (obj instanceof Error) ? `\n  ${obj.stack}` : util_1.format(obj);
}
//# sourceMappingURL=logger.js.map