"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelloController {
    index(req, res, next) {
        res.status(200).json({ message: 'Hello welcome to the Vlugmoor API.' });
    }
}
exports.default = HelloController;
//# sourceMappingURL=HelloController.js.map