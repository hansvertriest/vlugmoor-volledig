import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import { IUser, User, IMetaData, MetaData } from '../../models/mongoose';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private db: Connection;

  // seeders

  private users: Array<IUser>;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;

    // arrays aanmaken

    this.users = [];
  }

  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongoose
        .connect(this.config.mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .then(data => {
          this.db = mongoose.connection;

          this.logger.info('Connected to the mongodb database', {});

          resolve(true);
        })
        .catch(error => {
          this.logger.error("Can't connect to the database", error);

          reject(error);
        });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
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

  // Seeders

  private userCreate = async (
    email: string,
    password: string,
    role: string,
    firstname: string,
    lastname: string
  ) => {
    const userDetail = {
      email,
      localProvider: {
        password
      },
      role,
      firstname,
      lastname
    };

    const user: IUser = new User(userDetail);

    try {
      const createdUser = await user.save();
      this.users.push(createdUser);

      this.logger.info(`User created with id: ${createdUser._id}`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating a user ${err}`, err);
    }
  };

  private createUsers = async () => {
    //const promises = [];

    this.userCreate(
      'arneverl@student.arteveldehs.be',
      '2468',
      'administrator',
      'Arne',
      'Verleyen'
    );
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

  private getRandomUser = () => {
    let user: IUser = null;
    if (this.users && this.users.length > 0) {
      user = this.users[Math.floor(Math.random() * this.users.length)];
    }
    return user;
  };

  // Alle seeders aanspreken indien nodig.

  public seed = async () => {
    this.users = await User.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createUsers();
        }
        return User.find().exec();
      });
  };
}

export default MongoDBDatabase;
