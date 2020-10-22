import { NextFunction, Request, Response } from 'express';
import { IVenue, Venue } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class VenueController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let venues;

      if (limit && skip) {
        venues = await Venue.paginate({});
      } else {
        venues = await Venue.find()
          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(venues);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const venue = await Venue.findById(id).exec();
      return res.status(200).json(venue);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const venueCreate = new Venue({
        name: req.body.name,
        description: req.body.description,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
      });
      const venue = await venueCreate.save();
      return res.status(201).json(venue);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const venue = await Venue.findById(id).exec();

      if (!venue) {
        throw new NotFoundError();
      } else {
        const vm = {
          venue,
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
      const venueUpdate = {
        name: req.body.name,
        description: req.body.description,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
      };
      const venue = await Venue.findOneAndUpdate({ _id: id }, venueUpdate, {
        new: true,
      }).exec();

      if (!venue) {
        throw new NotFoundError();
      }
      return res.status(200).json(venue);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let venue = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          venue = await Venue.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          venue = await Venue.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          venue = await Venue.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!venue) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Venue with id: ${id}!`,
          venue,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default VenueController;
