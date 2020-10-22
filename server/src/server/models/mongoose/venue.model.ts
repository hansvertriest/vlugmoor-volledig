import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

interface IVenue extends Document {
  name: string;
  description: string;
  city: string;
  street: string;
  houseNumber: number;
  picture: string;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

interface IVenueModel extends PaginateModel<IVenue> {}

const venueSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 128,
    },
    description: {
      type: String,
      max: 2056,
    },
    city: {
      type: String,
      max: 128,
    },
    street: {
      type: String,
      max: 128,
    },
    houseNumber: {
      type: Number,
      max: 10000,
    },
    picture: {
      type: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

venueSchema.virtual('id').get(function(this: IVenue) {
  return this._id;
});

venueSchema.plugin(mongoosePaginate);
const Venue = mongoose.model<IVenue, IVenueModel>('venue', venueSchema);

export { IVenue, Venue, venueSchema };
