"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("../../models/mongoose");
class MongoDBDatabase {
    constructor(logger, config) {
        // Seeders
        this.userCreate = async (email, password, role, firstname, lastname) => {
            const userDetail = {
                email,
                localProvider: {
                    password
                },
                role,
                firstname,
                lastname
            };
            const user = new mongoose_2.User(userDetail);
            try {
                const createdUser = await user.save();
                this.users.push(createdUser);
                this.logger.info(`User created with id: ${createdUser._id}`, {});
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a user ${err}`, err);
            }
        };
        this.createUsers = async () => {
            //const promises = [];
            this.userCreate('arneverl@student.arteveldehs.be', '2468', 'administrator', 'Arne', 'Verleyen');
            /*
        
            for (let i = 0; i < 30; i++) {
              const gender = Math.round(Math.random());
              promises.push(
                this.userCreate(
                  faker.internet.email(),
                  'nmdgent007!',
                  'user',
                  faker.name.firstName(gender),
                  faker.name.lastName(gender),
                )
              );
            }
            */
            // return await Promise.all(promises);
        };
        this.getRandomUser = () => {
            let user = null;
            if (this.users && this.users.length > 0) {
                user = this.users[Math.floor(Math.random() * this.users.length)];
            }
            return user;
        };
        // Alle seeders aanspreken indien nodig.
        this.seed = async () => {
            this.users = await mongoose_2.User.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createUsers();
                }
                return mongoose_2.User.find().exec();
            });
        };
        this.logger = logger;
        this.config = config;
        // arrays aanmaken
        this.users = [];
    }
    connect() {
        return new Promise((resolve, reject) => {
            mongoose_1.default
                .connect(this.config.mongoDBConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
                .then(data => {
                this.db = mongoose_1.default.connection;
                this.logger.info('Connected to the mongodb database', {});
                resolve(true);
            })
                .catch(error => {
                this.logger.error("Can't connect to the database", error);
                reject(error);
            });
        });
    }
    disconnect() {
        return new Promise((resolve, reject) => {
            this.db
                .close(true)
                .then(data => {
                resolve(data);
            })
                .catch(error => {
                this.logger.error("Can't disconnect the database", error);
                reject(error);
            });
        });
    }
}
exports.default = MongoDBDatabase;
//# sourceMappingURL=MongoDBDatabase.js.map