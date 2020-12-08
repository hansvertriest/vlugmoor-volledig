import { Application, Request, Response } from 'express';
import { default as chalk } from 'chalk';
import { default as moment } from 'moment';
import { default as morgan, TokenIndexer } from 'morgan';

class MorganMiddleware {
  public static load(app: Application): void {
    const morganMiddleware = morgan(
      (
        tokens: TokenIndexer<Request, Response>,
        req: Request,
        res: Response
      ) => {
        return [
          chalk
            .hex('#ffffff')
            .bold(
              `${moment(tokens.date(req, res)).format('YYYY-MM-DD hh:mm:ss')}`
            ),
          chalk.hex('#34ace0').bold(`[${tokens.method(req, res)}]`),
          ':\t',
          chalk.hex('#ff5252').bold(`[${tokens.url(req, res)}]`),
          chalk.hex('#f78fb3').bold(`[${tokens.status(req, res)}]`),
          chalk.hex('#fffff').bold(`${tokens['response-time'](req, res)}ms`),
          chalk.hex('#fffff').bold(tokens['remote-addr'](req, res)),
          ''
        ].join(' ');
      }
    );
    app.use(morganMiddleware);
  }
}

export default MorganMiddleware;
