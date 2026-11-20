import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJourney extends Document {
  userId: mongoose.Types.ObjectId;
  schemeId: string;
  currentStage: number;
  completedStages: number[];
  status: 'in_progress' | 'completed' | 'on_hold';
  updatedAt: Date;
}

const JourneySchema = new Schema<IJourney>(
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
    currentStage: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    completedStages: {
      type: [Number],
      default: [1],
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'on_hold'],
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so each user maintains one independent journey record per scheme
JourneySchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const Journey: Model<IJourney> =
  mongoose.models.Journey || mongoose.model<IJourney>('Journey', JourneySchema);
