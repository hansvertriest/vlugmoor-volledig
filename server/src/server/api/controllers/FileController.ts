import { NextFunction, Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { default as path } from 'path';

import { default as multer } from 'multer';

import { NotFoundError } from '../../utilities';

class FileController {
  constructor() {}
  store = async () => {};

  upload = () => {
    const storage = multer.diskStorage({
      destination: '../../uploads/',
      filename: function(req, file, cb) {
        cb(
          null,
          file.originalname + '-' + Date.now() + path.extname(file.originalname)
        );
      }
    });
    const upload = multer({ storage: storage }).single('myCsv');
  };

  /*

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, '../../uploads')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
        }
      });
//      let upload = multer({storage: storage});
//      this.upload.single('')
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  */
}

export default FileController;
