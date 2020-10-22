import { NextFunction, Request, Response } from 'express';
import { IOnlineEvent, OnlineEvent, User } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class OnlineEventController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let onlineEvents;

      if (limit && skip) {

        onlineEvents = await OnlineEvent.paginate({});
      } else {
        const options = { path: 'user' };
        onlineEvents = await OnlineEvent.find()

          .populate(options)

          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(onlineEvents);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const onlineEvent = await OnlineEvent.findById(id).exec();
      return res.status(200).json(onlineEvent);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vm = {
        users: await User.find(),
      };
      return res.status(200).json(vm);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const onlineEventCreate = new OnlineEvent({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        picture: req.body.picture,
        duration: req.body.duration,
        link: req.body.link,
        date: req.body.date,
        _userId: req.body._userId,
      });
      const onlineEvent = await onlineEventCreate.save();
      return res.status(201).json(onlineEvent);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const onlineEvent = await OnlineEvent.findById(id).exec();

      if (!onlineEvent) {
        throw new NotFoundError();
      } else {
        const vm = {
          onlineEvent,
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
      const onlineEventUpdate = {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        picture: req.body.picture,
        duration: req.body.duration,
        link: req.body.link,
        date: req.body.date,
        _userId: req.body._userId,
      };
      const onlineEvent = await OnlineEvent.findOneAndUpdate(
        { _id: id },
        onlineEventUpdate,
        {
          new: true,
        },
      ).exec();

      if (!onlineEvent) {
        throw new NotFoundError();
      }
      return res.status(200).json(onlineEvent);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let onlineEvent = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          onlineEvent = await OnlineEvent.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          onlineEvent = await OnlineEvent.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          onlineEvent = await OnlineEvent.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!onlineEvent) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the online event with id: ${id}!`,
          onlineEvent,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default OnlineEventController;
