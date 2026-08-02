import mongoose, { Schema, Document, Model } from "mongoose";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  owner: mongoose.Types.ObjectId;
  jobId?: string;
  result?: string;
  error?: string;
  retryCount: number;
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: String,
    },
    result: {
      type: String,
    },
    error: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    scheduledFor: {
      type: Date,
    },
  },
  { timestamps: true },
);

// dashboard queries and list view both filter by owner + status together,
// so one compound index beats two separate single-field ones
taskSchema.index({ owner: 1, status: 1 });

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;
