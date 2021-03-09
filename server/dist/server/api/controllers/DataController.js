"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
const utilities_1 = require("../../utilities");
class DataController {
    constructor() {
        this.index = async (req, res, next) => {
            try {
                const { limit, skip } = req.query;
                let datas;
                if (limit && skip) {
                    const options = {
                        limit: parseInt(limit, 10) || 10,
                        page: parseInt(skip, 10) || 1,
                        sort: { _createdAt: -1 },
                        populate: ['metaData']
                    };
                    datas = await mongoose_1.Data.paginate({}, options);
                }
                else {
                    const options = [{ path: 'metaData' }];
                    datas = await mongoose_1.Data.find()
                        .populate(options)
                        .sort({ _createdAt: -1 })
                        .exec();
                }
                return res.status(200).json(datas);
            }
            catch (err) {
                next(err);
            }
        };
        this.show = async (req, res, next) => {
            try {
                const { id } = req.params;
                const data = await mongoose_1.Data.findById(id).exec();
                return res.status(200).json(data);
            }
            catch (err) {
                next(err);
            }
        };
        this.destroy = async (req, res, next) => {
            const { id } = req.params;
            console.log(id);
            try {
                let data = null;
                let { mode } = req.query;
                switch (mode) {
                    case 'delete':
                    default:
                        data = await mongoose_1.Data.findOneAndRemove({ _id: id });
                        break;
                    case 'softdelete':
                        data = await mongoose_1.Data.findByIdAndUpdate({ _id: id }, { _deletedAt: Date.now() });
                        break;
                    case 'softundelete':
                        data = await mongoose_1.Data.findByIdAndUpdate({ _id: id }, { _deletedAt: null });
                        break;
                }
                if (!data) {
                    throw new utilities_1.NotFoundError();
                }
                else {
                    return res.status(200).json({
                        message: `Successful ${mode} the MetaData with id: ${id}!`,
                        data,
                        mode
                    });
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.edit = async (req, res, next) => {
            const { id } = req.params;
            try {
                const data = await mongoose_1.Data.findById(id).exec();
                if (!data) {
                    throw new utilities_1.NotFoundError();
                }
                else {
                    const vm = {
                        data
                    };
                    return res.status(200).json(vm);
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.update = async (req, res, next) => {
            const { id } = req.params;
            try {
                const dataUpdate = {
                    data: req.body.data
                };
                const data = await mongoose_1.Data.findOneAndUpdate({ _id: id }, dataUpdate, {
                    new: true
                }).exec();
                if (!data) {
                    throw new utilities_1.NotFoundError();
                }
                return res.status(200).json(data);
            }
            catch (err) {
                next(err);
            }
        };
        this.store = async (req, res, next) => {
            try {
                const dataCreate = new mongoose_1.Data({
                    data: req.body.data
                });
                const data = await dataCreate.save();
                console.log(data);
                return res.status(201).json({ id: data._id });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const vm = {
                    datas: await mongoose_1.Data.find()
                };
                return res.status(200).json(vm);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = DataController;
//# sourceMappingURL=DataController.js.map