import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    tenantId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

postSchema.index({ tenantId: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
