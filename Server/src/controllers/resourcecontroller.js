import Post from "../models/postModel.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ tenantId: req.tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      tenantId: req.tenantId
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const removed = await Post.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId
    });

    if (!removed) return res.status(404).json({ message: "Not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
