import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Unauthorized = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access the admin dashboard.
          </p>
          
          <div className="bg-white rounded-lg shadow p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Admin Access Requirements:
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                Must be a registered BUSA mentor
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                Email must be in the mentor list
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                Account must have 'mentor' role
              </li>
            </ul>
          </div>

          {user && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Currently signed in as: <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This account does not have mentor privileges.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
            
            {user && (
              <button
                onClick={logout}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need mentor access?{' '}
              <a 
                href="mailto:admin@busa.kr" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Contact the admin team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized 