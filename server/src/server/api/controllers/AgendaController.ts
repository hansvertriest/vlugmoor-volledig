import { NextFunction, Request, Response } from 'express';
import { IAgenda, Agenda, User } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class AgendaController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let agendas;

      if (limit && skip) {
        agendas = await Agenda.paginate({});
      } else {
        const options = [{ path: 'event' }, { path: 'user' }];
        agendas = await Agenda.find()

          .populate(options)

          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(agendas);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const agenda = await Agenda.findById(id).exec();
      return res.status(200).json(agenda);
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
      const agendaCreate = new Agenda({
        _userId: req.body._userId,
        _eventIds: req.body._eventIds,
      });
      const agenda = await agendaCreate.save();
      return res.status(201).json(agenda);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const agenda = await Agenda.findById(id).exec();

      if (!agenda) {
        throw new NotFoundError();
      } else {
        const vm = {
          agenda,
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
      const agendaUpdate = {
        _userId: req.body._userId,
        _eventIds: req.body._eventIds,
      };
      const agenda = await Agenda.findOneAndUpdate({ _id: id }, agendaUpdate, {
        new: true,
      }).exec();

      if (!agenda) {
        throw new NotFoundError();
      }
      return res.status(200).json(agenda);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let agenda = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          agenda = await Agenda.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          agenda = await Agenda.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          agenda = await Agenda.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!agenda) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Venue with id: ${id}!`,
          agenda,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default AgendaController;
