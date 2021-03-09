"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("../api/router"));
const controllers_1 = require("../controllers");
const services_1 = require("../services");
class Router {
    constructor(rootPath, app, config, authService) {
        this.app = app;
        this.config = config;
        this.authService = authService;
        this.homeController = new controllers_1.HomeController();
        this.fallbackController = new controllers_1.FallbackController();
        this.apiRouter = new router_1.default(config, authService);
        this.registerRoutes(rootPath);
    }
    registerRoutes(rootPath) {
        this.app.use('/api', this.apiRouter.router);
        this.app.use('*', (req, res, next) => {
            if (this.config.env === services_1.Environment.production) {
                res.sendFile(path_1.default.resolve(rootPath, 'client', 'index.html'));
            }
            else {
                res.sendFile(path_1.default.resolve(rootPath, '..', '..', 'client', 'build', 'index.html'));
            }
        });
    }
}
exports.default = Router;
//# sourceMappingURL=Router.js.map