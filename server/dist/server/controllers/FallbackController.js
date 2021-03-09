"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
class FallbackController {
    index(req, res, next) {
        next(new utilities_1.NotFoundError());
    }
}
exports.default = FallbackController;
//# sourceMappingURL=FallbackController.js.map