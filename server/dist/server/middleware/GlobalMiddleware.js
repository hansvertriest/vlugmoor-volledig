"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const services_1 = require("../services");
class GlobalMiddleware {
    static load(rootPath, app, config) {
        app.use(body_parser_1.default.urlencoded({ limit: '250mb', extended: true }));
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json({ limit: '250mb' }));
        app.use(express_1.default.static(path_1.default.resolve(rootPath, 'server', 'static')));
        //app.use(multer);
        app.set('views', path_1.default.resolve(rootPath, 'server', 'views'));
        app.set('view engine', 'ejs');
        /*
         * React Client build
         */
        if (config.env === services_1.Environment.production) {
            app.use(express_1.default.static(path_1.default.resolve(rootPath, 'client')));
        }
        else {
            app.use(express_1.default.static(path_1.default.resolve(rootPath, '..', '..', 'react-client', 'build')));
        }
        // Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!
        app.use(helmet_1.default.hidePoweredBy());
        app.use(helmet_1.default.ieNoOpen());
        app.use(helmet_1.default.noSniff());
        app.use(helmet_1.default.xssFilter());
        // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
        const corsOptions = {
            Origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            exposedHeaders: ['x-auth-token'],
            Headers: 'Content-Type'
        };
        app.use(cors_1.default(corsOptions));
    }
}
exports.default = GlobalMiddleware;
//# sourceMappingURL=GlobalMiddleware.js.map