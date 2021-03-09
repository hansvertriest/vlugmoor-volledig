import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
// import { IData } from './data.model';
import { IUser } from './user.model';

interface IMetaData extends Document {
  title: string;
  description: string;

  picture: string;
  caseDataPath: string;
  coordsPath: string;
  forcesPath: string;
  windPath: string;
  date: Date;
  published: boolean;

  slug: string;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _userId: IUser['_id'];
  slugify(): void;
}

interface IMetaDataModel extends PaginateModel<IMetaData> {}

const metaDataSchema: Schema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

metaDataSchema.methods.slugify = function(this: any) {
  this.slug = slug(this.title);
};

metaDataSchema.pre<IMetaData>('validate', function(next) {
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

metaDataSchema.plugin(mongoosePaginate);
const MetaData = mongoose.model<IMetaData, IMetaDataModel>(
  'metaData',
  metaDataSchema
);

export { IMetaData, IMetaDataModel, MetaData, metaDataSchema };
