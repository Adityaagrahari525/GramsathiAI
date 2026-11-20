import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  district: string;
  taluka: string;
  village?: string;
  preferredLanguage: 'mr' | 'hi' | 'en';
  interests: string[];
  role: 'citizen' | 'vle' | 'admin';
  gender?: string;
  occupation?: string;
  landholdingAcres?: number;
  socialCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
    },
    passwordHash: {
      type: String,
      select: false, // Hidden by default from queries for safety
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      default: 'Pune',
    },
    taluka: {
      type: String,
      required: [true, 'Taluka is required'],
      trim: true,
      default: 'Baramati',
    },
    village: {
      type: String,
      trim: true,
      default: '',
    },
    preferredLanguage: {
      type: String,
      enum: ['mr', 'hi', 'en'],
      default: 'mr',
    },
    interests: {
      type: [String],
      default: ['agri', 'solar', 'housing'],
    },
    role: {
      type: String,
      enum: ['citizen', 'vle', 'admin'],
      default: 'citizen',
    },
    gender: {
      type: String,
      trim: true,
      default: 'Male',
    },
    occupation: {
      type: String,
      trim: true,
      default: 'Farmer / Cultivator',
    },
    landholdingAcres: {
      type: Number,
      min: 0,
      default: 2.5,
    },
    socialCategory: {
      type: String,
      trim: true,
      default: 'OBC',
    },
  },
  {
    timestamps: true,
  }
);

// Compound validation: user must have either phone or email
UserSchema.pre('validate', function (next) {
  if (!this.phone && !this.email) {
    next(new Error('At least one of phone or email must be provided for registration'));
  } else {
    next();
  }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
