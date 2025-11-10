import express from "express";
import { getPosts, createPost, deletePost } from "../controllers/resourcecontroller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { tenantResolver } from "../middlewares/tenantResolver.js";

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(tenantResolver);

router.get("/", authorizeRoles("viewer", "editor", "admin"), getPosts);
router.post("/", authorizeRoles("editor", "admin"), createPost);
router.delete("/:id", authorizeRoles("admin"), deletePost);

export default router;
