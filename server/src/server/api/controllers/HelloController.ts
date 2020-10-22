import { NextFunction, Request, Response } from 'express';

class HelloController {
  public index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any> | void {
    res
      .status(200)
      .json({ message: 'Hello welcome tho the MERN-stack Application' });
  }
}

export default HelloController;
