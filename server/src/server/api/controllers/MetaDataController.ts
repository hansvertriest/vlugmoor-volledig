import { NextFunction, Request, Response } from 'express';
import { MetaData, IMetaData, User } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class MetaDataController {
  constructor() {}

  public index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any>> => {
    try {
      const { limit, skip } = req.query;
      let metaData = null;
      if (limit && skip) {
        metaData = await MetaData.paginate({});
      } else {
        metaData = await MetaData.find()
          .sort({ created_at: -1 })
          .exec();
      }

      return res.status(200).json(metaData);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const metaData = await MetaData.findById(id).exec();
      return res.status(200).json(metaData);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id);
    try {
      let metaData = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          metaData = await MetaData.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          metaData = await MetaData.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() }
          );
          break;
        case 'softundelete':
          metaData = await MetaData.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null }
          );
          break;
      }

      if (!metaData) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the MetaData with id: ${id}!`,
          metaData,
          mode
        });
      }
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const metaData = await MetaData.findById(id).exec();

      if (!metaData) {
        throw new NotFoundError();
      } else {
        const vm = {
          metaData
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
      const metaDataUpdate = {
        title: req.body.title,
        description: req.body.description,
        picture: req.body.picture,
        date: req.body.date,
        _dataId: req.body._dataId,
        caseDataPath: req.body.caseDataPath,
        coordsPath: req.body.coordsPath,
        forcesPath: req.body.forcesPath,
        windPath: req.body.windPath,
        published: req.body.published
      };
      const metaData = await MetaData.findOneAndUpdate(
        { _id: id },
        metaDataUpdate,
        {
          new: true
        }
      ).exec();

      if (!metaData) {
        throw new NotFoundError();
      }
      return res.status(200).json(metaData);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metaDataCreate = new MetaData({
        title: req.body.title,
        description: req.body.description,
        picture: req.body.picture,
        date: req.body.date,
        _dataId: req.body._dataId,
        caseDataPath: req.body.caseDataPath,
        coordsPath: req.body.coordsPath,
        forcesPath: req.body.forcesPath,
        windPath: req.body.windPath,
        published: req.body.published
      });
      const metaData = await metaDataCreate.save();
      return res.status(201).json(metaData);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vm = {
        metadatas: await MetaData.find()
      };
      return res.status(200).json(vm);
    } catch (err) {
      next(err);
    }
  };
}

export default MetaDataController;
