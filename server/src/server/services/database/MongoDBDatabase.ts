import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import {
  IUser,
  User,
  ICategory,
  Category,
  IEvent,
  Event,
  IVenue,
  Venue,
  IAgenda,
  Agenda,
  IOnlineEvent,
  OnlineEvent,
} from '../../models/mongoose';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private db: Connection;

  // seeders
  private categories: Array<ICategory>;
  private users: Array<IUser>;
  private onlineEvents: Array<IOnlineEvent>;
  private events: Array<IEvent>;
  private venues: Array<IVenue>;
  private agendas: Array<IAgenda>;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;

    // arrays aanmaken
    this.categories = [];
    this.users = [];
    this.onlineEvents = [];
    this.venues = [];
    this.events = [];
    this.agendas = [];
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

  private getRandomCategory = () => {
    let category: ICategory = null;
    if (this.categories && this.categories.length > 0) {
      category = this.categories[
        Math.floor(Math.random() * this.categories.length)
      ];
    }
    return category;
  };

  private categoryCreate = async (name: string, description: string) => {
    const categoryDetail = {
      name,
      description,
    };

    const category: ICategory = new Category(categoryDetail);

    try {
      const createdCategory = await category.save();
      this.categories.push(createdCategory);

      this.logger.info(`Category created with id: ${createdCategory._id}`, {});
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a category ${err}`,
        err,
      );
    }
  };

  private createCategories = async () => {
    const promises = [];

    for (let i = 0; i < 8; i++) {
      promises.push(
        this.categoryCreate(faker.lorem.word(), faker.lorem.paragraph()),
      );
    }

    return await Promise.all(promises);
  };

  private getRandomEventsArray(nEvents: number) {
    const tempEvents = JSON.parse(JSON.stringify(this.events)) as Array<IEvent>;
    const arrayOfIds = [];
    while (arrayOfIds.length < nEvents) {
      const removedEvent = tempEvents.splice(
        Math.floor(Math.random() * nEvents),
        1,
      )[0];
      arrayOfIds.push(removedEvent._id);
    }
    return arrayOfIds;
  }

  private getRandomUser = () => {
    let user: IUser = null;
    if (this.users && this.users.length > 0) {
      user = this.users[Math.floor(Math.random() * this.users.length)];
    }
    return user;
  };

  private getRandomVenue = () => {
    let venue: IVenue = null;
    if (this.venues && this.venues.length > 0) {
      venue = this.venues[Math.floor(Math.random() * this.venues.length)];
    }
    return venue;
  };

  private eventCreate = async (
    title: string,
    description: string,
    location: string,
    city: string,
    street: string,
    houseNumber: number,
    tags: string,
    picture: string,
    duration: number,
    price: number,
    date: number,
  ) => {
    const eventDetail = {
      title,
      description,
      location,
      city,
      street,
      houseNumber,
      tags,
      picture,
      duration,
      price,
      date,
      _userId: this.getRandomUser()._id,
      _venueId: this.getRandomVenue()._id,
      _categoryId: this.getRandomCategory()._id,
    };

    const event: IEvent = new Event(eventDetail);

    try {
      const createdEvent = await event.save();
      this.events.push(createdEvent);

      this.logger.info(`Event created with id: ${createdEvent._id}.`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating an event ${err}!`, {
        err,
      });
    }
  };

  private createEvents = async () => {
    const promises = [];

    for (let i = 0; i < 30; i++) {
      promises.push(
        this.eventCreate(
          faker.lorem.sentence(4),
          faker.lorem.paragraph(30),
          faker.address.city(),
          faker.address.city(),
          faker.address.streetName(),
          faker.random.number(1000),
          faker.random.words(),
          faker.random.image(),
          faker.random.number(1000),
          Date.now(),
          Date.now(),
        ),
      );
    }

    await Promise.all(promises);
  };

  private venueCreate = async (
    name: string,
    description: string,
    city: string,
    street: string,
    houseNumber: number,
    picture: string,
  ) => {
    const venueDetail = {
      name,
      description,
      city,
      street,
      houseNumber,
      picture,
    };

    const venue: IVenue = new Venue(venueDetail);

    try {
      const createdVenue = await venue.save();
      this.venues.push(createdVenue);

      this.logger.info(`Venue created with id: ${createdVenue._id}.`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating a venue ${err}!`, {
        err,
      });
    }
  };

  private createVenues = async () => {
    const promises = [];

    for (let i = 0; i < 30; i++) {
      promises.push(
        this.venueCreate(
          faker.lorem.word(),
          faker.lorem.paragraph(),
          faker.address.city(),
          faker.address.streetName(),
          faker.random.number(999),
          faker.random.image(),
        ),
      );
    }

    await Promise.all(promises);
  };

  private agendaCreate = async () => {
    const agendaDetail = {
      _eventIds: this.getRandomEventsArray(5),
      _userId: this.getRandomUser()._id,
    };
    const agenda: IAgenda = new Agenda(agendaDetail);

    try {
      const createdAgenda = await agenda.save();
      this.agendas.push(createdAgenda);

      this.logger.info(`Agenda created with id: ${createdAgenda._id}.`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating an agenda ${err}!`, {
        err,
      });
    }
  };

  private createAgendas = async () => {
    const promises = [];

    for (let i = 0; i < 5; i++) {
      promises.push(this.agendaCreate());
    }

    return await Promise.all(promises);
  };

  private onlineEventCreate = async (
    title: string,
    description: string,
    tags: string,
    picture: string,
    duration: number,
    date: number,
    link: string,
  ) => {
    const onlineEventDetail = {
      title,
      description,
      tags,
      picture,
      duration,
      date,
      link,
      _userId: this.getRandomUser()._id,
    };

    const onlineEvent: IOnlineEvent = new OnlineEvent(onlineEventDetail);

    try {
      const createdOnlineEvent = await onlineEvent.save();
      this.onlineEvents.push(createdOnlineEvent);

      this.logger.info(
        `Online event created with id: ${createdOnlineEvent._id}.`,
        {},
      );
    } catch (err) {
      this.logger.error(
        `An error occurred when creating an online event ${err}!`,
        { err },
      );
    }
  };

  private createOnlineEvents = async () => {
    const promises = [];

    for (let i = 0; i < 30; i++) {
      promises.push(
        this.onlineEventCreate(
          faker.lorem.word(),
          faker.lorem.paragraph(1),
          faker.lorem.words(5),
          faker.random.image(),
          faker.random.number(1000),
          Date.now(),
          faker.internet.url(),
        ),
      );
    }

    await Promise.all(promises);
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
    this.categories = await Category.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createCategories();
        }
        return Category.find().exec();
      });
    this.venues = await Venue.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createVenues();
        }
        return Venue.find().exec();
      });

    this.events = await Event.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createEvents();
        }
        return Event.find().exec();
      });

    this.agendas = await Agenda.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createAgendas();
        }
        return Agenda.find().exec();
      });
    this.onlineEvents = await OnlineEvent.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createOnlineEvents();
        }
        return OnlineEvent.find().exec();
      });
  };
}

export default MongoDBDatabase;
