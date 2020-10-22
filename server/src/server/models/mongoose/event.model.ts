import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
import { ICategory } from './category.model';
import { IVenue } from './venue.model';
import { IUser } from './user.model';

interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  street: string;
  houseNumber: number;
  tags: string;
  picture: string;
  duration: number;
  price: number;
  date: Date;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _userId: IUser['_id'];
  _venueId: IVenue['_id'];
  _categoryId: ICategory['_id'];

  slugify(): void;
}

interface IEventModel extends PaginateModel<IEvent> {}

const eventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: 128,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: false,
    },
    description: {
      type: String,
      required: true,
      max: 2056,
    },
    location: {
      type: String,
      required: true,
      max: 128,
    },
    street: {
      type: String,
      requiered: true,
      max: 128,
    },
    city: {
      type: String,
      required: true,
      max: 128,
    },
    houseNumber: {
      type: Number,
      required: false,
    },
    tags: {
      type: String,
      required: false,
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
    price: {
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
    _venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: false,
    },
    _categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

eventSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

eventSchema.pre<IEvent>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

eventSchema.virtual('id').get(function(this: IEvent) {
  return this._id;
});

eventSchema.virtual('category', {
  ref: 'Category',
  localField: '_categoryId',
  foreignField: '_id',
  justOne: false,
});

eventSchema.virtual('venue', {
  ref: 'Venue',
  localField: '_venueId',
  foreignField: '_id',
  justOne: false,
});

eventSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: false,
});

eventSchema.plugin(mongoosePaginate);
const Event = mongoose.model<IEvent, IEventModel>('event', eventSchema);

export { IEvent, eventSchema, Event };
