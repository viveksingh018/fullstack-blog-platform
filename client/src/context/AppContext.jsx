import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"

// Set backend base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const AppContext = createContext()

export const AppProvider = ({ children }) => {

  const navigate = useNavigate()

  // Global states
  const [token, setToken] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState("")

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/blog/all')
      data.success ? setBlogs(data.blogs) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Load blogs + restore token on app start
  useEffect(() => {
    fetchBlogs()

    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      axios.defaults.headers.common['Authorization'] = savedToken
    }
  }, [])

  // Shared context values
  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
