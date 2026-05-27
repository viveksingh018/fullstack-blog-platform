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
      fileName: imageFile.originalname || 'blog-image',
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
    if (!blog) {
      return res.json({ success: false, message: 'Blog not found' })
    }

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


// Helper: clean meta-intro lines if model fir bhi daal de
const cleanContent = (text = '') => {
  return text
    .replace(/Here'?s a blog post[^]*?\n\n/i, '')    // "Here's a blog post..."
    .replace(/Here is a blog post[^]*?\n\n/i, '')    // "Here is a blog post..."
    .trim()
}


// Generate blog content using AI (Gemini)
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body
    // prompt: frontend se aayega, e.g.
    // "Title: AI and Jobs: A Look at the Future of Work\nSubtitle: How artificial intelligence is changing careers, skills, and opportunities"

    if (!prompt) {
      return res.json({ success: false, message: 'Prompt is required' })
    }

    const systemInstructions = `
You are an expert blog writer.
Write like a real human, in clear, simple, conversational English suitable for 16–30 year old Indian readers.

Hard rule:
- Do NOT write any meta sentences like:
  - "Here's a blog post..."
  - "In this blog post we will discuss..."
  - "This article is about..."
  - "Here is your blog in simple text format."
If you write any of these, your answer will be considered invalid.

Writing rules:
- Do not say that you are an AI or that this is generated content.
- Start directly with the blog content, not with a description of the blog.
- Make the writing engaging, with short paragraphs, subheadings, and a friendly tone.
- Avoid repetition and robotic wording.
- Length: 900–1300 words.

Task:

I will give you only:
- a blog title
- a blog subtitle

Based ONLY on these, write a complete blog article.

Structure:
1. Start directly with a strong hook sentence or question (no meta-intro, no explanation of the task).
2. Use 3–5 H2 subheadings with short, attractive titles.
3. Use bullet points or numbered lists where helpful.
4. Keep a balanced tone: honest about challenges, but also positive and practical.
5. End with a short, powerful closing paragraph.

Input format:
Title: <TITLE_HERE>
Subtitle: <SUBTITLE_HERE>

Output format:
- First line: H1 with the title (Markdown, starting with "# ").
- Second line: italic subtitle (Markdown, wrapped in single * on both sides).
- Then the full blog body in clean Markdown.
- Do NOT include any explanations, notes, meta-text, or prompt text in the output.
`

    const fullPrompt = `${prompt}\n\n${systemInstructions}`

    const raw = await main(fullPrompt)
    const content = cleanContent(raw)

    res.json({ success: true, content })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
