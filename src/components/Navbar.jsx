import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu, X, Settings, LogOut, ChevronDown,
  Home, Info, Calendar, BookOpen, Users, Mail
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import speakingClubLogo from '../assets/speaking-club-logo.jpeg'

const navigationItems = [
  { name: 'Home',     href: '/',        icon: Home },
  { name: 'About',    href: '/about',   icon: Info },
  { name: 'Events',   href: '/events',  icon: Calendar },
  { name: 'Sessions', href: '/sessions',icon: BookOpen },
  { name: 'Mentors',  href: '/mentors', icon: Users },
  { name: 'Contact',  href: '/contact', icon: Mail },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, isMentor, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeMenus = () => {
    setIsOpen(false)
    setShowUserMenu(false)
  }

  const userInitial = (user?.displayName || user?.email || '?')[0].toUpperCase()

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            onClick={closeMenus}
          >
            <img
              src={speakingClubLogo}
              alt="BUSA Speaking Club"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-100 shadow-sm"
            />
            <div className="leading-tight">
              <h1 className="text-base font-heading font-bold text-gray-900 tracking-tight">
                BUSA <span className="text-primary-600">Speaking</span> Club
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block tracking-wide">
                Connect · Speak · Thrive
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-lg group ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all duration-150"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">{userInitial}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {isMentor && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                      Mentor
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{userInitial}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.displayName || 'BUSA Member'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {isMentor && (
                        <Link
                          to="/admin"
                          onClick={closeMenus}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-primary-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                        Sign Out
                      </button>
                    </div>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Join BUSA
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMenus}
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive(item.href) ? 'text-primary-500' : 'text-gray-400'}`} />
                {item.name}
                {isActive(item.href) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            )
          })}

          {/* Mobile auth */}
          <div className="border-t border-gray-100 pt-3 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-xl mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{userInitial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  {isMentor && (
                    <span className="ml-auto text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                      Mentor
                    </span>
                  )}
                </div>

                {isMentor && (
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 text-center border border-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenus}
                  className="block px-3 py-3 rounded-xl text-sm font-semibold text-white text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm"
                >
                  Join BUSA
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
