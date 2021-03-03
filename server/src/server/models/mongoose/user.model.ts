import { default as mongoose, Schema, Document } from 'mongoose';
import { default as bcrypt } from 'bcrypt';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';

interface ILocalProvider {
  password: string;
}

interface IUser extends Document {
  email: string;
  firstname: string;
  lastname: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  localProvider?: ILocalProvider;

  role: string;

  comparePassword(candidatePassword: String, cb: Function): void;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstname: {
      type: String,
      required: true,
      unique: false
    },
    lastname: {
      type: String,
      required: true,
      unique: false
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    localProvider: {
      password: {
        type: String,
        required: false
      }
    },
    role: {
      type: String,
      enum: ['user', 'administrator'],
      default: 'user',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre<IUser>('save', function(next) {
  const user: IUser = this as IUser;

  if (!user.isModified('localProvider.password')) return next();

  try {
    return bcrypt.genSalt(10, (errSalt, salt) => {
      if (errSalt) throw errSalt;

      bcrypt.hash(user.localProvider.password, salt, (errHash, hash) => {
        if (errHash) throw errHash;

        user.localProvider.password = hash;
        return next();
      });
    });
  } catch (err) {
    return next(err);
  }
});

userSchema.virtual('id').get(function(this: IUser) {
  return this._id;
});

userSchema.methods.comparePassword = function(
  candidatePassword: String,
  cb: Function
) {
  const user: IUser = this as IUser;

  bcrypt.compare(
    candidatePassword,
    user.localProvider.password,
    (err, isMatch) => {
      if (err) return cb(err, null);
      else {
        return cb(isMatch);
      }
    }
  );
};

const User = mongoose.model<IUser>('User', userSchema);

export { IUser, User, userSchema };
