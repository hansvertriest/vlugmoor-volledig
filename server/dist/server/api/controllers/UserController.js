"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
const utilities_1 = require("../../utilities");
class UserController {
    constructor(config, authService) {
        this.index = async (req, res, next) => {
            try {
                const { limit, skip } = req.query;
                let users = null;
                if (limit && skip) {
                    users = await mongoose_1.User.paginate({});
                }
                else {
                    users = await mongoose_1.User.find()
                        .sort({ created_at: -1 })
                        .exec();
                }
                return res.status(200).json(users);
            }
            catch (err) {
                next(err);
            }
        };
        this.show = async (req, res, next) => {
            try {
                const { id } = req.params;
                const user = await mongoose_1.User.findById(id).exec();
                return res.status(200).json(user);
            }
            catch (err) {
                next(err);
            }
        };
        this.destroy = async (req, res, next) => {
            const { id } = req.params;
            try {
                let user = null;
                let { mode } = req.query;
                switch (mode) {
                    case 'delete':
                    default:
                        user = await mongoose_1.User.findOneAndRemove({ _id: id });
                        break;
                    case 'softdelete':
                        user = await mongoose_1.User.findByIdAndUpdate({ _id: id }, { _deletedAt: Date.now() });
                        break;
                    case 'softundelete':
                        user = await mongoose_1.User.findByIdAndUpdate({ _id: id }, { _deletedAt: null });
                        break;
                }
                if (!user) {
                    throw new utilities_1.NotFoundError();
                }
                else {
                    return res.status(200).json({
                        message: `Successful ${mode} the User with id: ${id}!`,
                        user,
                        mode
                    });
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.signupLocal = async (req, res, next) => {
            const { email, password } = req.body;
            console.log('hallo', req);
            let foundUser = await mongoose_1.User.findOne({ email: email });
            if (foundUser) {
                return res.status(403).json({ error: 'Email is already in use' });
            }
            const newUser = new mongoose_1.User({
                email: email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                role: req.body.role,
                localProvider: {
                    password: password
                }
            });
            const user = await newUser.save();
            const token = this.authService.createToken(user);
            return res.status(200).json({
                email: user.email,
                token: `${token}`,
                strategy: 'local',
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname
            });
        };
        this.signInLocal = async (req, res, next) => {
            this.authService.passport.authenticate('local', { session: this.config.auth.jwt.session }, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new utilities_1.NotFoundError());
                }
                const token = this.authService.createToken(user);
                return res.status(200).json({
                    email: user.email,
                    token: `${token}`,
                    strategy: 'local',
                    role: user.role
                });
            })(req, res, next);
        };
        this.edit = async (req, res, next) => {
            const { id } = req.params;
            try {
                const user = await mongoose_1.User.findById(id).exec();
                if (!user) {
                    throw new utilities_1.NotFoundError();
                }
                else {
                    const vm = {
                        user
                    };
                    return res.status(200).json(vm);
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.update = async (req, res, next) => {
            const { id } = req.params;
            try {
                const userUpdate = {
                    email: req.body.email,
                    firstname: req.body.profile.firstName,
                    lastname: req.body.profile.lastName,
                    role: req.body.role,
                    password: req.body.localProvider.password
                };
                const user = await mongoose_1.User.findOneAndUpdate({ _id: id }, userUpdate, {
                    new: true
                }).exec();
                if (!user) {
                    throw new utilities_1.NotFoundError();
                }
                return res.status(200).json(user);
            }
            catch (err) {
                next(err);
            }
        };
        this.store = async (req, res, next) => {
            try {
                const userCreate = new mongoose_1.User({
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    role: req.body.role,
                    password: req.body.localProvider.password
                });
                const user = await userCreate.save();
                return res.status(201).json(user);
            }
            catch (err) {
                next(err);
            }
        };
        this.config = config;
        this.authService = authService;
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map