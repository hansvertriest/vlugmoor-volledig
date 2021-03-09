"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
class FileController {
    constructor() {
        this.store = async () => { };
        this.upload = () => {
            const storage = multer_1.default.diskStorage({
                destination: '../../uploads/',
                filename: function (req, file, cb) {
                    cb(null, file.originalname + '-' + Date.now() + path_1.default.extname(file.originalname));
                }
            });
            const upload = multer_1.default({ storage: storage }).single('myCsv');
        };
    }
}
exports.default = FileController;
//# sourceMappingURL=FileController.js.map