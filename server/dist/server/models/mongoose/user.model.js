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
exports.userSchema = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.userSchema = userSchema;
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('localProvider.password'))
        return next();
    try {
        return bcrypt_1.default.genSalt(10, (errSalt, salt) => {
            if (errSalt)
                throw errSalt;
            bcrypt_1.default.hash(user.localProvider.password, salt, (errHash, hash) => {
                if (errHash)
                    throw errHash;
                user.localProvider.password = hash;
                return next();
            });
        });
    }
    catch (err) {
        return next(err);
    }
});
userSchema.virtual('id').get(function () {
    return this._id;
});
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    const user = this;
    bcrypt_1.default.compare(candidatePassword, user.localProvider.password, (err, isMatch) => {
        if (err)
            return cb(err, null);
        else {
            return cb(isMatch);
        }
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.model.js.map