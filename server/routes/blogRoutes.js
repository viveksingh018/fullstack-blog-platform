import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogByID,
  getBlogComments,
  togglePublish
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// Create a new blog (protected + with image upload)
blogRouter.post("/add", upload.single('image'), auth, addBlog);

// Public routes
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogByID);

// Blog admin actions
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

// Comments
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);

// AI blog content generator (protected)
blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
