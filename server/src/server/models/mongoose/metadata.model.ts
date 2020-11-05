import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
import { IUser } from './user.model';

interface IOnlineEvent extends Document {
  title: string;
  description: string;

  picture: string;
  date: Date;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _userId: IUser['_id'];
}

interface IOnlineEventModel extends PaginateModel<IOnlineEvent> {}

const onlineEventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: 128,
    },
    description: {
      type: String,
      required: true,
      max: 2056,
    },
    picture: {
      type: String,
      required: false,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    _createdAt: {
      type: Number,
      required: false,
      default: Date.now(),
    },
    _modifiedAt: {
      type: Number,
      required: false,
      default: null,
    },
    _deletedAt: {
      type: Number,
      required: false,
      default: null,
    },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

onlineEventSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

onlineEventSchema.virtual('id').get(function(this: IOnlineEvent) {
  return this._id;
});

onlineEventSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: false,
});

onlineEventSchema.plugin(mongoosePaginate);
const OnlineEvent = mongoose.model<IOnlineEvent, IOnlineEventModel>(
  'onlineEvent',
  onlineEventSchema,
);

export { IOnlineEvent, onlineEventSchema, OnlineEvent };
