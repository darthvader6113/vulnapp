import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseModule {
  title: string;
  content: string;
  duration?: string;
}

export interface ICourseAttachment {
  name: string;
  url: string;
  fileType?: string;
  size?: number;
  uploadedAt: Date;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  instructorId: string;
  instructorName: string;
  isPublished: boolean;
  modules: ICourseModule[];
  attachments: ICourseAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  duration: { type: String, default: "15 min" },
});

const CourseAttachmentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  fileType: { type: String },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
});

const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      default: "General",
    },
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    modules: [CourseModuleSchema],
    attachments: [CourseAttachmentSchema],
  },
  {
    timestamps: true,
  }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

