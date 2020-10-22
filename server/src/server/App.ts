import { default as http, createServer, Server } from 'http';
import {
  default as express,
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';

import { default as Router } from './router';
import {
  GlobalMiddleware,
  MorganMiddleware,
  SwaggerMiddleware,
} from './middleware';
import { IAppError } from './utilities';
import { Environment, ILogger, IConfig, AuthService } from './services';

class App {
  public app: Application;
  private rootPath: string;
  private config: IConfig;
  private logger: ILogger;
  private router: Router;
  private server: Server;
  private authService: AuthService;

  constructor(rootPath: string, logger: ILogger, config: IConfig) {
    this.rootPath = rootPath;
    this.logger = logger;
    this.config = config;

    this.createExpress();
    this.createServer();
  }

  private createExpress(): void {
    this.app = express();
    GlobalMiddleware.load(this.rootPath, this.app, this.config);
    if (this.config.env === Environment.development) {
      MorganMiddleware.load(this.app);
    }
    SwaggerMiddleware.load(this.rootPath, this.app, this.config);
    this.createPassport();
    this.createRouter();
    this.app.use(this.errorHandler);
  }

  private errorHandler(
    error: IAppError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    res.status(error.status ? error.status : 500);

    if (req.accepts('html')) {
      res.render('pages/404', { url: req.url });
      return;
    }

    if (req.accepts('json')) {
      res.json({ error });
      return;
    }

    res.type('txt').send('Not found');
  }

  private createServer(): void {
    this.server = createServer(this.app);
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('close', () => {
      this.logger.info('Server is closed!', {});
    });
    this.server.on('listening', () => {
      this.logger.info(
        `Server is listening on ${this.config.server.host}:${this.config.server.port}`,
        {},
      );
    });
  }

  private createPassport(): void {
    this.authService = new AuthService(this.config);
  }

  private createRouter(): void {
    this.router = new Router(
      this.rootPath,
      this.app,
      this.config,
      this.authService,
    );
  }

  public start(): void {
    this.server.listen(this.config.server.port, this.config.server.host);
  }

  public stop(): void {
    this.server.close((error?: Error) => {
      this.gracefulShutdown(error);
    });
  }

  private gracefulShutdown(error?: Error): void {
    this.logger.info('Server is gracefully shutdown!', error || {});

    if (error) {
      process.exit(1);
    }
    process.exit();
  }
}

export default App;
