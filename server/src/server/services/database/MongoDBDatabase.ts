import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import {
  IUser,
  User,
} from '../../models/mongoose';

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
          useUnifiedTopology: true,
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
    firstName: string,
    lastName: string,
    avatar: string,
  ) => {
    const userDetail = {
      email,
      localProvider: {
        password,
      },
      role,
      profile: {
        firstName,
        lastName,
        avatar,
      },
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
    const promises = [];

    this.userCreate(
      'arneverl@student.arteveldehs.be',
      '2468',
      'administrator',
      'Arne',
      'Verleyen',
      'https://scontent-bru2-1.xx.fbcdn.net/v/t1.0-9/28379571_1337089683058557_2119606842872933977_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=tW5Xsq3L3S0AX_V1PZn&_nc_ht=scontent-bru2-1.xx&oh=1defea6efe998620d8a584428fb404ba&oe=5EDD6A4E',
    );

    for (let i = 0; i < 30; i++) {
      const gender = Math.round(Math.random());
      promises.push(
        this.userCreate(
          faker.internet.email(),
          'nmdgent007!',
          'user',
          faker.name.firstName(gender),
          faker.name.lastName(gender),
          faker.internet.avatar(),
        ),
      );
    }

    return await Promise.all(promises);
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
