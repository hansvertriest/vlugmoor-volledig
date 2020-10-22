import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import { default as slug } from 'slug';
import { default as mongoosePaginate } from 'mongoose-paginate';

interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  slugify(): void;
}

interface ICategoryModel extends PaginateModel<ICategory> {}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: false, max: 128 },
    slug: { type: String, lowercase: true, unique: false, required: true },
    description: { type: String, required: false, max: 1024 },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },

    /*_eventIds: {
			type: [Schema.Types.ObjectId],
			ref: 'Event',

		}*/
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CategorySchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

CategorySchema.pre<ICategory>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

CategorySchema.virtual('id').get(function(this: ICategory) {
  return this._id;
});

CategorySchema.plugin(mongoosePaginate);
const Category = mongoose.model<ICategory, ICategoryModel>(
  'Category',
  CategorySchema,
);

export { ICategory, Category, CategorySchema };
