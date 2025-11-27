import jwt from 'jsonwebtoken'

// Admin authentication middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization

  try {
    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (error) {
    res.json({ success: false, message: "Invalid token" })
  }
}

export default auth
