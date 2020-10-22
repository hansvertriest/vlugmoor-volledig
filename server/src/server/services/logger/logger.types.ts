export enum LoggLevel {
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export interface ILogger {
  error(msg: string, obj: object): void;
  info(msg: string, obj: object): void;
  warning(msg: string, obj: object): void;
}
