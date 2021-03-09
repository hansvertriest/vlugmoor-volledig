"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("../../models/mongoose");
const utilities_1 = require("../../utilities");
class AuthService {
    constructor(config) {
        this.LocalStrategy = passport_local_1.default.Strategy;
        this.ExtractJwt = passport_jwt_1.default.ExtractJwt;
        this.JwtStrategy = passport_jwt_1.default.Strategy;
        this.initializeJwtStrategy = () => {
            passport_1.default.use(new this.JwtStrategy({
                secretOrKey: this.config.auth.jwt.secret,
                jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken()
            }, async (jwtPayload, done) => {
                try {
                    const { id } = jwtPayload;
                    const user = await mongoose_1.User.findById(id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                }
                catch (error) {
                    return done(error, false);
                }
            }));
        };
        this.checkIsInRole = (...roles) => (req, res, next) => {
            if (!req.user) {
                next(new utilities_1.ForbiddenError());
            }
            const hasRole = roles.find(role => req.user.role === role);
            if (!hasRole) {
                next(new utilities_1.UnauthorizedError());
            }
            return next();
        };
        this.config = config;
        this.initializeLocalStrategy();
        this.initializeJwtStrategy();
        passport_1.default.serializeUser((user, done) => {
            done(null, user);
        });
        passport_1.default.deserializeUser((user, done) => {
            done(null, user);
        });
        this.passport = passport_1.default;
    }
    initializeLocalStrategy() {
        passport_1.default.use(new this.LocalStrategy({
            usernameField: 'email'
        }, async (email, password, done) => {
            try {
                const user = await mongoose_1.User.findOne({
                    email: email
                });
                if (!user) {
                    return done(null, false, { message: 'No user by that email' });
                }
                return user.comparePassword(password, (isMatch) => {
                    if (!isMatch) {
                        // Is match returnt null is niet de bedoelingk he
                        return done(null, false);
                    }
                    return done(null, user);
                });
            }
            catch (error) {
                return done(error, false);
            }
        }));
    }
    createToken(user) {
        const payload = {
            id: user._id
        };
        return jsonwebtoken_1.default.sign(payload, this.config.auth.jwt.secret, {
            expiresIn: 60 * 120
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=AuthService.js.map