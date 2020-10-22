import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

import { IUser } from './user.model';
import { IEvent } from './event.model';

interface IAgenda extends Document {
  _userId: IUser['_id'];
  _eventIds: Array<IEvent['_id']>;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

interface IAgendaModel extends PaginateModel<IAgenda> {}

const agendaSchema: Schema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _eventIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Event',
      required: false,
    },

    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

agendaSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: false,
});
agendaSchema.virtual('event', {
  ref: 'Event',
  localField: '_eventIds',
  foreignField: '_id',
  justOne: false,
});

agendaSchema.plugin(mongoosePaginate);
const Agenda = mongoose.model<IAgenda, IAgendaModel>('Agenda', agendaSchema);

export { IAgenda, Agenda };
