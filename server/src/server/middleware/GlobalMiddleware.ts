import { default as express, Application } from 'express';
import { default as bodyParser } from 'body-parser';

import { default as cors } from 'cors';
import { default as helmet } from 'helmet';
import { default as path } from 'path';

import { default as multer } from 'multer';

import { IConfig, Environment } from '../services';

class GlobalMiddleware {
  public static load(rootPath: string, app: Application, config: IConfig) {
    app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '250mb' }));
    app.use(express.static(path.resolve(rootPath, 'server', 'static')));
    //app.use(multer);
    app.set('views', path.resolve(rootPath, 'server', 'views'));
    app.set('view engine', 'ejs');
    /*
     * React Client build
     */
    if (config.env === Environment.production) {
      app.use(express.static(path.resolve(rootPath, 'client')));
    } else {
      app.use(
        express.static(
          path.resolve(rootPath, '..', '..', 'react-client', 'build')
        )
      );
    }

    // Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!
    app.use(helmet.hidePoweredBy());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());

    // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
    const corsOptions = {
      Origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      exposedHeaders: ['x-auth-token'],
      Headers: 'Content-Type'
    };
    app.use(cors(corsOptions));
  }
}

export default GlobalMiddleware;
