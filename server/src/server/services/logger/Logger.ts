import { default as winston, createLogger, format, transports } from 'winston';

import { ILogger, LoggLevel } from './logger.types';

class Logger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const { align, combine, colorize, timestamp, printf } = format;

    this.logger = createLogger({
      format: combine(
        colorize(),
        timestamp(),
        align(),
        printf(info => {
          const { timestamp, level, message, ...args } = info;

          const ts = timestamp.slice(0, 19).replace('T', ' ');
          return `${ts} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`;
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: './error.log', level: 'error' }),
        new transports.File({ filename: './combined.log' }),
      ],
      exitOnError: false,
    });
  }

  private log(level: string, msg: string, obj: object) {
    this.logger.log(level, msg, {
      object: obj,
      timestamp: new Date().toISOString(),
    });
  }

  public error(msg: string, obj: object) {
    this.log(LoggLevel.error, msg, obj);
  }

  public info(msg: string, obj: object) {
    this.log(LoggLevel.info, msg, obj);
  }

  public warning(msg: string, obj: object) {
    this.log(LoggLevel.warning, msg, obj);
  }
}

export default Logger;
