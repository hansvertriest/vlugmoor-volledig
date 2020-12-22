import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

interface IData extends Document {
  data: Object;

  _metaDataId: IData['_id'];
}

interface IDataModel extends PaginateModel<IData> {}

const dataSchema: Schema = new Schema({
  data: {
    type: Object,
    required: true
  }
});

dataSchema.plugin(mongoosePaginate);
const Data = mongoose.model<IData, IDataModel>('data', dataSchema);

export { IData, IDataModel, Data, dataSchema };
