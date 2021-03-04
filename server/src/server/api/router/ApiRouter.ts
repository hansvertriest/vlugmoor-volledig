import {
  default as express,
  Application,
  Request,
  Response,
  Router,
  NextFunction,
  response
} from 'express';
import { Data } from 'src/server/models/mongoose';
import { IConfig, AuthService, Role } from '../../services';
import {
  HelloController,
  UserController,
  MetaDataController,
  DataController,
  FileController
} from '../controllers';

import { default as multer } from 'multer';
import { default as path } from 'path';
import { nextTick } from 'process';
import { default as fs } from 'fs';

class ApiRouter {
  public router: Router;

  private helloController: HelloController;
  private userController: UserController;
  private metaDataController: MetaDataController;
  private dataController: DataController;
  private fileController: FileController;

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
    this.dataController = new DataController();
    this.fileController = new FileController();
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
    this.router.get('/metadata/:id', this.metaDataController.show);
    this.router.post('/metadata', this.metaDataController.store);
    this.router.get('/metadata/:id/edit', this.metaDataController.edit);
    this.router.put('/metadata/:id', this.metaDataController.update);
    this.router.delete('/metadata/:id', this.metaDataController.destroy);
    /*
     * Data routes
     */
    this.router.get('/data', this.dataController.index);
    this.router.get('/data/create', this.dataController.create);
    this.router.get('/data/:id', this.dataController.show);
    this.router.post('/data', this.dataController.store);
    this.router.get('/data/:id/edit', this.dataController.edit);
    this.router.put('/data/:id', this.dataController.update);
    this.router.delete('/data/:id', this.dataController.destroy);

    this.router.post('/auth/signin/', this.userController.signInLocal);
    this.router.post('/auth/signup/', this.userController.signupLocal);

    /*
     * Upload file route
     */

    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename: function(req: Request, file: any, cb: any) {
        cb(
          null,
          file.originalname + '-' + Date.now() + path.extname(file.originalname)
        );

        req.body.path =
          file.originalname +
          '-' +
          Date.now() +
          path.extname(file.originalname);

        console.log(req.body.path + 'hier');
      }
    });
    const upload = multer({ storage: storage }).single('file');

    // Upload file
    this.router.post('/upload', upload, (req: any, res: Response) => {
      // console.log(req.file);
      // console.log(req.file.path);
      return res.json({ message: 'file sent', path: req.file.path });
    });

    // Download file
    this.router.get('/upload/:path', function(req, res) {
      const { path } = req.params;
      if (path !== 'no wind') {
        console.log(path);
        var src = fs.createReadStream(`uploads/${path}`);
        src.on('open', function() {
          src.pipe(res);
          console.log('download completed');
        });
        src.on('error', function(err: any) {
          console.log(err);
        });
      }
    });

    // Delete file

    function deleteFile(path: string) {
      fs.unlink(path, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    this.router.delete('/upload/:path', (req, res) => {
      const path = `uploads/${req.params.path}`;

      var stream = fs.createReadStream(path);
      stream.pipe(res).once('close', function() {
        stream.close();
        deleteFile(path);
      });
    });
  }
}

export default ApiRouter;
