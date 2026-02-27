import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  Star,
  Plus,
  Clock,
  MapPin,
  Video,
  Eye,
  Upload,
  AlertCircle
} from 'lucide-react'
import { collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore'
import { db } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAttendees: 0,
    averageRating: 0,
    upcomingSessions: 0
  })
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setFetchError(null)

      // Fetch recent 5 sessions for the list
      const recentQuery = query(
        collection(db, 'sessions'),
        orderBy('date', 'desc'),
        limit(5)
      )
      const recentSnapshot = await getDocs(recentQuery)
      const sessionsData = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      }))

      // Total session count — not limited by the query above
      const totalCountSnapshot = await getCountFromServer(collection(db, 'sessions'))
      const totalSessions = totalCountSnapshot.data().count

      // Sum attendees using the correct field name
      const totalAttendees = sessionsData.reduce(
        (sum, session) => sum + (session.currentAttendees || 0),
        0
      )

      // Average rating (only sessions that have a rating)
      const ratedSessions = sessionsData.filter(s => s.rating)
      const averageRating = ratedSessions.length > 0
        ? (ratedSessions.reduce((sum, s) => sum + s.rating, 0) / ratedSessions.length).toFixed(1)
        : '—'

      // Upcoming sessions count
      const upcomingSnapshot = await getCountFromServer(
        query(collection(db, 'sessions'), where('date', '>=', new Date()))
      )

      setStats({
        totalSessions,
        totalAttendees,
        averageRating,
        upcomingSessions: upcomingSnapshot.data().count
      })

      setRecentSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setFetchError('Could not load dashboard data. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
        <p className="text-sm text-gray-500 mb-4">{fetchError}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Sessions',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Average Rating',
      value: stats.averageRating === '—' ? '—' : `${stats.averageRating}★`,
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      name: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Clock,
      color: 'bg-primary-500',
    }
  ]

  const quickActions = [
    {
      name: 'Add New Session',
      description: 'Create a new speaking session',
      href: '/admin/sessions?action=create',
      icon: Plus,
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      name: 'Upload Photos',
      description: 'Add photos from recent sessions',
      href: '/admin/photos',
      icon: Upload,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'View Registrations',
      description: 'Manage session registrations',
      href: '/admin/registration',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with BUSA Speaking Club.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/admin/sessions?action=create"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Sessions
              </h3>
              <Link
                to="/admin/sessions"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            {recentSessions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No sessions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {session.type === 'zoom' ? (
                        <Video className="w-8 h-8 text-blue-500" />
                      ) : (
                        <MapPin className="w-8 h-8 text-green-500" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {session.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.date.toLocaleDateString()}
                        {' • '}{session.currentAttendees ?? 0} attendees
                        {session.rating ? ` • ${session.rating}★` : ''}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        to="/admin/sessions"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`flex items-center p-3 rounded-lg text-white transition-colors duration-200 ${action.color}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">{action.name}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
