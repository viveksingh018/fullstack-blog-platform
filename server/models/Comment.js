import mongoose from "mongoose";

// Comment schema definition
const commentSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

// Comment model
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
