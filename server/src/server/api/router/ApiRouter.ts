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
  EventController,
  VenueController,
  CategoryController,
  AgendaController,
  OnlineEventController,
} from '../controllers';

class ApiRouter {
  public router: Router;

  private helloController: HelloController;
  private userController: UserController;
  private eventController: EventController;
  private venueController: VenueController;
  private categoryController: CategoryController;
  private agendaController: AgendaController;
  private onlineEventController: OnlineEventController;

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

    this.venueController = new VenueController();
    this.eventController = new EventController();
    this.categoryController = new CategoryController();
    this.onlineEventController = new OnlineEventController();
    this.agendaController = new AgendaController();
  }

  private registerRoutes(): void {
    /*
     * Hello routes
     */
    this.router.get('/hello', this.helloController.index);
    /*
     *	Event routes
     */
    this.router.get('/events', this.eventController.index);
    this.router.get('/events/create', this.eventController.create);
    this.router.get('/events/:id', this.eventController.show);
    this.router.post('/events', this.eventController.store);
    this.router.get('/events/:id/edit', this.eventController.edit);
    this.router.put('/events/:id', this.eventController.update);
    this.router.delete('/events/:id', this.eventController.destroy);

    /*
     *	Venue routes
     */
    this.router.get('/venues', this.venueController.index);
    this.router.get('/venues/create', this.venueController.create);
    this.router.get('/venues/:id', this.venueController.show);
    this.router.post('/venues', this.venueController.store);
    this.router.get('/venues/:id/edit', this.venueController.edit);
    this.router.put('/venues/:id', this.venueController.update);
    this.router.delete('/venues/:id', this.venueController.destroy);

    /*
     * Category Routes
     */

    this.router.get('/categories', this.categoryController.index);
    this.router.get('/categories/create', this.categoryController.create);
    this.router.get('/categories/:id', this.categoryController.show);
    this.router.post('/categories', this.categoryController.store);
    this.router.get('/categories/:id/edit', this.categoryController.edit);
    this.router.put('/categories/:id', this.categoryController.update);
    this.router.delete('/categories/:id', this.categoryController.destroy);

    /*
     * Agenda Routes
     */

    this.router.get('/agendas', this.agendaController.index);
    this.router.get('/agendas/create', this.agendaController.create);
    this.router.get('/agendas/:id', this.agendaController.show);
    this.router.post('/agendas', this.agendaController.store);
    this.router.get('/agendas/:id/edit', this.agendaController.edit);
    this.router.put('/agendas/:id', this.agendaController.update);
    this.router.delete('/agendas/:id', this.agendaController.destroy);

    /*
     * Online event Routes
     */

    this.router.get('/onlineevents', this.onlineEventController.index);
    this.router.get('/onlineevents/create', this.onlineEventController.create);
    this.router.get('/onlineevents/:id', this.onlineEventController.show);
    this.router.post('/onlineevents', this.onlineEventController.store);
    this.router.get('/onlineevents/:id/edit', this.onlineEventController.edit);
    this.router.put('/onlineevents/:id', this.onlineEventController.update);
    this.router.delete('/onlineevents/:id', this.onlineEventController.destroy);
    /*
     * Users routes
     */
    this.router.get('/users', this.userController.index);
    this.router.get('/users/:id', this.userController.show);
    this.router.delete('/users/:id', this.userController.destroy);

    this.router.post('/auth/signin/', this.userController.signInLocal);
    this.router.post('/auth/signup/', this.userController.signupLocal);
  }
}

export default ApiRouter;
