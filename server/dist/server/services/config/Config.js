"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const config_types_1 = require("./config.types");
class Config {
    constructor() {
        dotenv_1.default.config();
        this.loadEnvironmentVariables();
    }
    loadEnvironmentVariables() {
        this.docs = Boolean(process.env.NODE_DOCS || false);
        this.env =
            config_types_1.Environment[(process.env.NODE_ENV ||
                config_types_1.Environment.development)];
        this.server = {
            host: process.env.NODE_SERVER_HOST || 'localhost',
            port: Number(process.env.NODE_SERVER_PORT || 8080),
            protocol: config_types_1.ServerProtocol[(process.env.NODE_SERVER_PROTOCOL ||
                config_types_1.ServerProtocol.http)]
        };
        this.mongoDBConnection = process.env.MONGODB_CONNECTION;
        this.auth = {
            bcryptSalt: Number(process.env.AUTH_BCRYPT_SALT || 10),
            jwt: {
                secret: process.env.AUTH_JWT_SECRET || 'gdm-nmd',
                session: Boolean(process.env.AUTH_JWT_SESSION || true)
            },
            facebook: {
                clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
                clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET
            }
        };
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map