import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const { navigate, token } = useAppContext()

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('lang') || 'en')

  // Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Apply Translation using Cookie (Most Reliable)
  useEffect(() => {
    const applyTranslation = () => {
      // Set Google Translate Cookie
      document.cookie = `googtrans=/en/${currentLang}; path=/;`
      
      const select = document.querySelector('.goog-te-combo')
      if (select) {
        select.value = currentLang
        select.dispatchEvent(new Event('change'))
        console.log(`✅ Applied: ${currentLang}`)
      }
    }

    // Multiple attempts
    setTimeout(applyTranslation, 600)
    setTimeout(applyTranslation, 1400)
    setTimeout(applyTranslation, 2200)
  }, [currentLang])

  const changeLang = (e) => {
    const newLang = e.target.value

    localStorage.setItem('lang', newLang)
    setCurrentLang(newLang)

    // Set cookie before reload
    document.cookie = `googtrans=/en/${newLang}; path=/;`

    // Refresh
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 bg-transparent text-black dark:text-white transition-colors duration-300">
      
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
      />

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Dark Mode */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xl cursor-pointer hover:scale-105 transition-transform"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Language Selector */}
        <select
          onChange={changeLang}
          value={currentLang}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm cursor-pointer outline-none font-medium"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>

        {/* Login Button */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 sm:px-10 py-2.5 hover:opacity-90 transition-opacity"
        >
          {token ? 'Dashboard' : 'Login'}
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      </div>
    </div>
  )
}

export default Navbar