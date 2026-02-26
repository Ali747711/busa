import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Plus,
  Clock,
  MapPin,
  Video,
  Download,
  Eye,
  Upload
} from 'lucide-react'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch recent sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        orderBy('date', 'desc'),
        limit(5)
      )
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      }))
      
      // Calculate stats
      const totalSessions = sessionsSnapshot.size
      const totalAttendees = sessionsData.reduce((sum, session) => sum + (session.attendees || 0), 0)
      const averageRating = sessionsData.length > 0 
        ? sessionsData.reduce((sum, session) => sum + (session.rating || 0), 0) / sessionsData.length 
        : 0
      
      // Count upcoming sessions
      const upcomingQuery = query(
        collection(db, 'sessions'),
        where('date', '>=', new Date())
      )
      const upcomingSnapshot = await getDocs(upcomingQuery)
      
      setStats({
        totalSessions,
        totalAttendees,
        averageRating: averageRating.toFixed(1),
        upcomingSessions: upcomingSnapshot.size
      })
      
      setRecentSessions(sessionsData)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Use demo data as fallback
      setStats({
        totalSessions: 127,
        totalAttendees: 1200,
        averageRating: 4.8,
        upcomingSessions: 4
      })
      setRecentSessions([
        {
          id: 1,
          title: 'Advanced Speaking Techniques',
          date: new Date('2024-12-15'),
          type: 'zoom',
          attendees: 45,
          rating: 5
        },
        {
          id: 2,
          title: 'Monthly Debate Session',
          date: new Date('2024-12-20'),
          type: 'offline',
          attendees: 32,
          rating: 4.7
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const statCards = [
    {
      name: 'Total Sessions',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      change: '+18%',
      changeType: 'increase'
    },
    {
      name: 'Average Rating',
      value: `${stats.averageRating}★`,
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2',
      changeType: 'increase'
    },
    {
      name: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Clock,
      color: 'bg-primary-500',
      change: '+3',
      changeType: 'increase'
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
      name: 'View Calendar',
      description: 'Check the session calendar',
      href: '/admin/calendar',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Export Data',
      description: 'Download session reports',
      href: '#',
      icon: Download,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
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
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm">
                          <div className="text-green-600 font-medium">
                            {stat.change}
                          </div>
                          <div className="text-gray-500 ml-1">
                            vs last month
                          </div>
                        </div>
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
                      {session.date.toLocaleDateString()} • {session.attendees} attendees • {session.rating}★
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-gray-400 hover:text-gray-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Activity Timeline */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <Plus className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New session <span className="font-medium text-gray-900">"Advanced Speaking"</span> created
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        2 hours ago
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Upload className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Photos uploaded for <span className="font-medium text-gray-900">December Debate</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        1 day ago
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 