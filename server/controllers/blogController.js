import fs from 'fs'
import imagekit from '../configs/imageKit.js'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import main from '../configs/gemini.js'

// Add a new blog
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } =
      JSON.parse(req.body.blog)

    const imageFile = req.file

    // Validate required fields
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" })
    }

    const fileBuffer = fs.readFileSync(imageFile.path)

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile,
      folder: "/blogs"
    })

    // Generate optimized image URL
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },     // Auto compress
        { format: 'webp' },      // Convert to modern format
        { width: '1280' }        // Resize width
      ]
    })

    const image = optimizedImageUrl

    // Save blog to database
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished
    })

    res.json({ success: true, message: "Blog added successfully" })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all published blogs (public)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
    res.json({ success: true, blogs })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get blog by ID (public)
export const getBlogByID = async (req, res) => {
  try {
    const { blogId } = req.params

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" })
    }

    res.json({ success: true, blog })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Delete a blog + related comments
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body

    await Blog.findByIdAndDelete(id)

    // Remove all comments linked to blog
    await Comment.deleteMany({ blog: id })

    res.json({ success: true, message: 'Blog deleted successfully' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Toggle publish status
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body

    const blog = await Blog.findById(id)
    blog.isPublished = !blog.isPublished
    await blog.save()

    res.json({ success: true, message: 'Blog status updated' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Add a comment (public)
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body

    await Comment.create({ blog, name, content })

    res.json({ success: true, message: 'Comment added for review' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get comments for a blog (approved only)
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true
    }).sort({ createdAt: -1 })

    res.json({ success: true, comments })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Generate blog content using AI (Gemini)
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body

    const content = await main(
      prompt + ' Generate a blog content for this topic in simple text format '
    )

    res.json({ success: true, content })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
