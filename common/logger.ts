import { SPLAT } from 'triple-beam';
import * as winston from 'winston';
import { format } from 'util';

export default class Logger {

    private winstonLogger: winston.Logger;

    constructor(loggerName: string) {
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
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf((info: any) => `${info.timestamp} ${info.level.toUpperCase().padStart(6)} [${loggerName}] ${info.message} ${printMeta(info[SPLAT])}`),
                    ),
                }),
            ],
        });
    }

    get level() {
        return this.winstonLogger.level;
    }

    log(level: string, message: string, ...meta: any[]) {
        this.winstonLogger.log(level, message, ...meta);
    }

    trace(message: string, ...meta: any[]) {
        this.winstonLogger.log('trace', message, ...meta);
    }

    debug(message: string, ...meta: any[]) {
        this.winstonLogger.log('debug', message, ...meta);
    }

    info(message: string, ...meta: any[]) {
        this.winstonLogger.log('info', message, ...meta);
    }

    warn(message: string, ...meta: any[]) {
        this.winstonLogger.log('warn', message, ...meta);
    }

    error(message: string, ...meta: any[]) {
        this.winstonLogger.log('error', message, ...meta);
    }

    severe(message: string, ...meta: any[]) {
        this.winstonLogger.log('severe', message, ...meta);
    }
}

function printMeta(meta: any[] | any): string {
    if (!meta) {
        return '';
    }
    if (Array.isArray(meta)) {
        return meta.map((o) => getErrorMessage(o)).join(' ');
    }
    return getErrorMessage(meta);
}

function getErrorMessage (obj: any): string {
    return (obj instanceof Error) ? `\n  ${obj.stack}` : format(obj);
}
