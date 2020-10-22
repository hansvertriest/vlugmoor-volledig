import { NextFunction, Request, Response } from 'express';
import { ICategory, Category } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class CategoryController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let categorys;

      if (limit && skip) {

        categorys = await Category.paginate({});
      } else {
        const options = [{ path: 'category' }, { path: 'user' }];
        categorys = await Category.find()

          .populate(options)

          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(categorys);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const category = await Category.findById(id).exec();
      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json();
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryCreate = new Category({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        tags: req.body.tags,
        category: req.body.category,
        picture: req.body.picture,
        duration: req.body.duration,
        price: req.body.price,
        date: req.body.date,
        venue: req.body.venue,
      });
      const category = await categoryCreate.save();
      return res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const category = await Category.findById(id).exec();

      if (!category) {
        throw new NotFoundError();
      } else {
        const vm = {
          category,
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
      const categoryUpdate = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        tags: req.body.tags,
        category: req.body.category,
        picture: req.body.picture,
        duration: req.body.duration,
        price: req.body.price,
        date: req.body.date,
        venue: req.body.venue,
      };
      const category = await Category.findOneAndUpdate(
        { _id: id },
        categoryUpdate,
        {
          new: true,
        },
      ).exec();

      if (!category) {
        throw new NotFoundError();
      }
      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let category = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          category = await Category.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          category = await Category.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          category = await Category.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!category) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Venue with id: ${id}!`,
          category,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default CategoryController;
