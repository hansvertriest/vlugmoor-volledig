import {
  default as express,
  Application,
  Request,
  Response,
  Router,
} from 'express';
import { IConfig, AuthService, Role } from '../../services';
import {
  HelloController,
  UserController,
  MetaDataController,
} from '../controllers';

class ApiRouter {
  public router: Router;

  private helloController: HelloController;
  private userController: UserController;
  private metaDataController: MetaDataController;

  // config / Authentication service

  private config: IConfig;
  private authService: AuthService;

  constructor(config: IConfig, authService: AuthService) {
    this.config = config;
    this.authService = authService;

    this.router = express.Router();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.helloController = new HelloController();
    this.userController = new UserController(this.config, this.authService);
    this.metaDataController = new MetaDataController();
  }

  private registerRoutes(): void {
    /*
     * Hello routes
     */
    this.router.get('/hello', this.helloController.index);
    /*
     * Users routes
     */
    this.router.get('/users', this.userController.index);
    this.router.get('/users/:id', this.userController.show);
    this.router.delete('/users/:id', this.userController.destroy);
    /*
     * Metadata routes
     */
    this.router.get('/metadata', this.metaDataController.index);
    this.router.get('/metadata/create', this.metaDataController.create);
    this.router.get('metadata/:id', this.metaDataController.show);
    this.router.post('/metadata', this.metaDataController.store);
    this.router.get('/metadata/:id/edit', this.metaDataController.edit);
    this.router.put('/metadata/:id', this.metaDataController.update);
    this.router.delete('/metadata/:id', this.metaDataController.destroy);

    this.router.post('/auth/signin/', this.userController.signInLocal);
    this.router.post('/auth/signup/', this.userController.signupLocal);
  }
}

export default ApiRouter;
