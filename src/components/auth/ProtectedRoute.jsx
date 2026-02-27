import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../LoadingSpinner'

const ProtectedRoute = ({
  children,
  requireMentor = false,
  requireAdmin = false,
  requireRootManager = false,
}) => {
  const { user, isMentor, isAdmin, isRootManager, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRootManager && !isRootManager) {
    return <Navigate to="/unauthorized" replace />
  }

  if (requireMentor && !isMentor) {
    return <Navigate to="/unauthorized" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute 