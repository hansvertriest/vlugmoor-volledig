"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ApiRouter {
    constructor(config, authService) {
        this.config = config;
        this.authService = authService;
        this.router = express_1.default.Router();
        this.registerControllers();
        this.registerRoutes();
    }
    registerControllers() {
        this.helloController = new controllers_1.HelloController();
        this.userController = new controllers_1.UserController(this.config, this.authService);
        this.metaDataController = new controllers_1.MetaDataController();
        this.dataController = new controllers_1.DataController();
        this.fileController = new controllers_1.FileController();
    }
    registerRoutes() {
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
        const storage = multer_1.default.diskStorage({
            destination: 'uploads/',
            filename: function (req, file, cb) {
                cb(null, file.originalname + '-' + Date.now() + path_1.default.extname(file.originalname));
                req.body.path =
                    file.originalname +
                        '-' +
                        Date.now() +
                        path_1.default.extname(file.originalname);
                console.log(req.body.path + 'hier');
            }
        });
        const upload = multer_1.default({ storage: storage }).single('file');
        // Upload file
        this.router.post('/upload', upload, (req, res) => {
            // console.log(req.file);
            // console.log(req.file.path);
            return res.json({ message: 'file sent', path: req.file.path });
        });
        // Download file
        this.router.get('/upload/:path', function (req, res) {
            const { path } = req.params;
            if (path !== 'no wind') {
                console.log(path);
                var src = fs_1.default.createReadStream(`uploads/${path}`);
                src.on('open', function () {
                    src.pipe(res);
                    console.log('download completed');
                });
                src.on('error', function (err) {
                    console.log(err);
                });
            }
        });
        // Delete file
        function deleteFile(path) {
            fs_1.default.unlink(path, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
        this.router.delete('/upload/:path', (req, res) => {
            const path = `uploads/${req.params.path}`;
            var stream = fs_1.default.createReadStream(path);
            stream.pipe(res).once('close', function () {
                stream.close();
                deleteFile(path);
            });
        });
    }
}
exports.default = ApiRouter;
//# sourceMappingURL=ApiRouter.js.map