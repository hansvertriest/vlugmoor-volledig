"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const middleware_1 = require("./middleware");
const services_1 = require("./services");
class App {
    constructor(rootPath, logger, config) {
        this.rootPath = rootPath;
        this.logger = logger;
        this.config = config;
        this.createExpress();
        this.createServer();
    }
    createExpress() {
        this.app = express_1.default();
        middleware_1.GlobalMiddleware.load(this.rootPath, this.app, this.config);
        if (this.config.env === services_1.Environment.development) {
            middleware_1.MorganMiddleware.load(this.app);
        }
        middleware_1.SwaggerMiddleware.load(this.rootPath, this.app, this.config);
        this.createPassport();
        this.createRouter();
        this.app.use(this.errorHandler);
    }
    errorHandler(error, req, res, next) {
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
    createServer() {
        this.server = http_1.createServer(this.app);
        this.server.on('error', (error) => {
            this.gracefulShutdown(error);
        });
        this.server.on('close', () => {
            this.logger.info('Server is closed!', {});
        });
        this.server.on('listening', () => {
            this.logger.info(`Server is listening on ${this.config.server.host}:${this.config.server.port}`, {});
        });
    }
    createPassport() {
        this.authService = new services_1.AuthService(this.config);
    }
    createRouter() {
        this.router = new router_1.default(this.rootPath, this.app, this.config, this.authService);
    }
    start() {
        this.server.listen(this.config.server.port, this.config.server.host);
    }
    stop() {
        this.server.close((error) => {
            this.gracefulShutdown(error);
        });
    }
    gracefulShutdown(error) {
        this.logger.info('Server is gracefully shutdown!', error || {});
        if (error) {
            process.exit(1);
        }
        process.exit();
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map