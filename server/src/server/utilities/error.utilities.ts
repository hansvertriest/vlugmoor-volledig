import { IAppError } from './utilities.types';

class AppError implements IAppError {
  public details?: string;
  public message: string = 'Something went wrong';
  public name: string = 'Error';
  public stack?: string;
  public status: number = 500;
  public timestamp: number = Date.now();
}

class ForbiddenError extends AppError {
  public message: string = 'Not allowed';
  public name: string = 'Forbidden';
  public status: number = 403;
}

class InternalServerError extends AppError {
  public message: string = 'Something went wrong';
  public name: string = 'Internal Server Error';
  public status: number = 500;
}

class NotFoundError extends AppError {
  public message: string = 'Resource not found';
  public name: string = 'Not Found';
  public status: number = 404;
}

class UnauthorizedError extends AppError {
  public message: string = 'Missing authorization';
  public name: string = 'Unauthorized';
  public status: number = 401;
}

export {
  AppError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
};
