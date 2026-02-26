import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Calendar, 
  CalendarDays,
  Upload,
  MapPin,
  FileText,
  BarChart3,
  LogOut,
  User,
  Users,
  Settings,
  Home,
  Star,
  Trophy,
  LayoutDashboard
} from 'lucide-react'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isMentor } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Calendar, label: 'Session Manager', href: '/admin/sessions' },
    { icon: Trophy, label: 'Event Manager', href: '/admin/events' },
    { icon: Users, label: 'Registration Manager', href: '/admin/registration' },
    { icon: User, label: 'User Manager', href: '/admin/user-manager' },
    { icon: Star, label: 'Success Stories', href: '/admin/success-stories' },
    { icon: Settings, label: 'Content Manager', href: '/admin/content' },
    // { icon: Upload, label: 'Upload Photos', href: '/admin/photos' }, // Disabled until Storage is enabled
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">B</span>
          </div>
          <span className="text-white font-heading font-bold text-lg">BUSA Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 bg-primary-800 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`${
                location.pathname === item.href
                  ? 'bg-primary-900 text-white'
                  : 'text-primary-100 hover:bg-primary-700'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <Icon
                className={`${
                  location.pathname === item.href ? 'text-white' : 'text-primary-300 group-hover:text-primary-100'
                } mr-3 flex-shrink-0 h-5 w-5`}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="flex-shrink-0 bg-primary-900 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || user?.email || 'Mentor'}
            </p>
            <p className="text-xs text-primary-300 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 flex space-x-2">
          <Link
            to="/"
            className="flex-1 text-center bg-primary-700 hover:bg-primary-600 text-white text-xs py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-3 h-3 mr-1" />
            Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <h1 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => location.pathname === item.href)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Mentor badge */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Mentor
              </span>
              
              {/* User avatar */}
              <div className="relative">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 