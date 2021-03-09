"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.NotFoundError = exports.InternalServerError = exports.ForbiddenError = exports.AppError = void 0;
class AppError {
    constructor() {
        this.message = 'Something went wrong';
        this.name = 'Error';
        this.status = 500;
        this.timestamp = Date.now();
    }
}
exports.AppError = AppError;
class ForbiddenError extends AppError {
    constructor() {
        super(...arguments);
        this.message = 'Not allowed';
        this.name = 'Forbidden';
        this.status = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends AppError {
    constructor() {
        super(...arguments);
        this.message = 'Something went wrong';
        this.name = 'Internal Server Error';
        this.status = 500;
    }
}
exports.InternalServerError = InternalServerError;
class NotFoundError extends AppError {
    constructor() {
        super(...arguments);
        this.message = 'Resource not found';
        this.name = 'Not Found';
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor() {
        super(...arguments);
        this.message = 'Missing authorization';
        this.name = 'Unauthorized';
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=error.utilities.js.map