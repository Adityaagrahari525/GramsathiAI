import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISavedScheme extends Document {
  userId: mongoose.Types.ObjectId;
  schemeId: string;
  savedAt: Date;
}

const SavedSchemeSchema = new Schema<ISavedScheme>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    schemeId: {
      type: String,
      required: [true, 'Scheme ID is required'],
      trim: true,
      index: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to strictly prevent duplicate bookmarks per user
SavedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const SavedScheme: Model<ISavedScheme> =
  mongoose.models.SavedScheme || mongoose.model<ISavedScheme>('SavedScheme', SavedSchemeSchema);
