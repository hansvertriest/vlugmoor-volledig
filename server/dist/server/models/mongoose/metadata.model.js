"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaDataSchema = exports.MetaData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const slug_1 = __importDefault(require("slug"));
const metaDataSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        max: 128
    },
    description: {
        type: String,
        required: true,
        max: 2056
    },
    picture: {
        type: String,
        required: false
    },
    published: {
        type: Boolean,
        required: false
    },
    caseDataPath: {
        type: String,
        required: false
    },
    coordsPath: {
        type: String,
        required: false
    },
    forcesPath: {
        type: String,
        required: false
    },
    windPath: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    slug: {
        type: String,
        required: false,
        lowercase: true,
        unique: false
    },
    _createdAt: {
        type: Number,
        required: false,
        default: Date.now()
    },
    _modifiedAt: {
        type: Number,
        required: false,
        default: null
    },
    _deletedAt: {
        type: Number,
        required: false,
        default: null
    },
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.metaDataSchema = metaDataSchema;
metaDataSchema.methods.slugify = function () {
    this.slug = slug_1.default(this.title);
};
metaDataSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify();
    }
    return next();
});
/*
metaDataSchema.virtual('id').get(function(this: IMetaData) {
  return this._id;
});


metaDataSchema.virtual('id').get(function(this: IData) {
    return this._id;
});
*/
metaDataSchema.virtual('user', {
    ref: 'User',
    localField: '_userId',
    foreignField: '_id',
    justOne: false
});
/*
metaDataSchema.virtual('data', {
    ref: 'Data',
    localField: '_dataId',
    foreignField: '_id',
    justOne: false
  });
*/
metaDataSchema.plugin(mongoose_paginate_1.default);
const MetaData = mongoose_1.default.model('metaData', metaDataSchema);
exports.MetaData = MetaData;
//# sourceMappingURL=metadata.model.js.map