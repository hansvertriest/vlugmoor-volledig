import { NextFunction, Request, Response } from 'express';
import { IEvent, Event, Category, User, Venue } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class EventController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let events;

      if (limit && skip) {
        events = await Event.paginate({});
      } else {
        const options = [{ path: 'category' }, { path: 'user' }];
        events = await Event.find()

          .populate(options)

          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(events);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const event = await Event.findById(id).exec();
      return res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vm = {
        categories: await Category.find(),
        users: await User.find(),
        venues: await Venue.find(),
      };
      return res.status(200).json(vm);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventCreate = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        tags: req.body.tags,
        picture: req.body.picture,
        duration: req.body.duration,
        price: req.body.price,
        date: req.body.date,
        _userId: req.body._userId,
        _categoryId: req.body._categoryId,
      });
      const event = await eventCreate.save();
      return res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const event = await Event.findById(id).exec();

      if (!event) {
        throw new NotFoundError();
      } else {
        const vm = {
          event,
        };
        return res.status(200).json(vm);
      }
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const eventUpdate = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        tags: req.body.tags,
        picture: req.body.picture,
        duration: req.body.duration,
        price: req.body.price,
        date: req.body.date,
        _userId: req.body._userId,
        _categoryId: req.body._categoryId,
      };
      const event = await Event.findOneAndUpdate({ _id: id }, eventUpdate, {
        new: true,
      }).exec();

      if (!event) {
        throw new NotFoundError();
      }
      return res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let event = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          event = await Event.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          event = await Event.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          event = await Event.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!event) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Venue with id: ${id}!`,
          event,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default EventController;

/*
import { NextFunction, Request, Response } from 'express';

import { IEvent, Event, eventSchema } from '../../models/mongoose';

class EventController {
	
	index = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const events = await Event.find().sort({ _createdAt: -1 }).exec();
			return res.status(200).json(events);
		} catch (err) {
			next(err);
		}
	};

	show = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;

			const event = await Event.findById(id);
			res.status(200).json(event);
		} catch (err) {
			next(err);
		}
	};
}

export default EventController; */
