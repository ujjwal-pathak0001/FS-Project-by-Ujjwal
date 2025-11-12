import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import tenantResolver from "../middlewares/tenantResolver.js";
import { getPosts, createPost, deletePost } from "../controllers/resourceController.js";

const router = express.Router();

// GET all posts of tenant
router.get("/:tenantId/posts", verifyToken, tenantResolver, getPosts);

// Create post
router.post("/:tenantId/posts", verifyToken, tenantResolver, createPost);

// Delete post
router.delete("/:tenantId/posts/:id", verifyToken, tenantResolver, deletePost);

export default router;
