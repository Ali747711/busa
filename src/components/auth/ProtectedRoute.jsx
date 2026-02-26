import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../LoadingSpinner'

const ProtectedRoute = ({ children, requireMentor = false, requireAdmin = false }) => {
  const { user, userRole, isMentor, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If mentor access is required but user is not a mentor
  if (requireMentor && !isMentor) {
    return <Navigate to="/unauthorized" replace />
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and authorized
  return children
}

export default ProtectedRoute 