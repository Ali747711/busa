import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Video,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

const RegistrationManager = () => {
  const [registrations, setRegistrations] = useState([])
  const [sessions, setSessions] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSession, setFilterSession] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch registrations
      const registrationsQuery = query(
        collection(db, 'registrations'),
        orderBy('registrationDate', 'desc')
      )
      const registrationsSnapshot = await getDocs(registrationsQuery)
      const registrationsData = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate() || new Date(doc.data().registrationDate),
        sessionDate: doc.data().sessionDate?.toDate() || new Date(doc.data().sessionDate)
      }))
      setRegistrations(registrationsData)

      // Fetch sessions for filter dropdown
      const sessionsQuery = query(collection(db, 'sessions'), orderBy('date', 'desc'))
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date)
      }))
      setSessions(sessionsData)

      // Fetch events for filter dropdown
      const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'))
      const eventsSnapshot = await getDocs(eventsQuery)
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date)
      }))
      setEvents(eventsData)

    } catch (error) {
      console.error('Error fetching data:', error)
      // Use demo data as fallback
      setRegistrations([
        {
          id: '1',
          firstName: 'Aziz',
          lastName: 'Karimov',
          email: 'aziz.karimov@example.com',
          phone: '+82 10 1234 5678',
          telegram: '@azizkarimov',
          university: 'Seoul National University',
          major: 'Computer Science',
          yearOfStudy: '3rd',
          englishLevel: 'advanced',
          sessionId: '1',
          sessionTitle: 'Public Speaking Masterclass',
          sessionDate: new Date('2024-12-15T14:00:00'),
          sessionType: 'zoom',
          itemType: 'session',
          registrationDate: new Date('2024-12-01T10:30:00'),
          status: 'confirmed',
          attended: false,
          previousParticipation: true,
          specialRequests: 'None'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const updateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'registrations', registrationId), {
        status: newStatus
      })
      
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      ))
    } catch (error) {
      console.error('Error updating registration status:', error)
      // Update locally if Firebase fails
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      ))
    }
  }

  const markAttendance = async (registrationId, attended) => {
    try {
      await updateDoc(doc(db, 'registrations', registrationId), {
        attended: attended
      })
      
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, attended: attended } : reg
      ))
    } catch (error) {
      console.error('Error updating attendance:', error)
      // Update locally if Firebase fails
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, attended: attended } : reg
      ))
    }
  }

  const deleteRegistration = async (registrationId, participantName) => {
    if (!confirm(`Are you sure you want to delete the registration for ${participantName}? This action cannot be undone.`)) {
      return
    }

    try {
      // Delete from Firebase
      await deleteDoc(doc(db, 'registrations', registrationId))
      
      // Remove from local state
      setRegistrations(registrations.filter(reg => reg.id !== registrationId))
      
      alert('Registration deleted successfully!')
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Error deleting registration. Please try again.')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Registration Date',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Telegram',
      'University',
      'Major',
      'Year of Study',
      'English Level',
      'Session/Event Title',
      'Session Date',
      'Type',
      'Status',
      'Attended',
      'Previous Participation',
      'Special Requests'
    ]

    const csvData = filteredRegistrations.map(reg => [
      reg.registrationDate.toLocaleDateString(),
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone || '',
      reg.telegram || '',
      reg.university,
      reg.major,
      reg.yearOfStudy,
      reg.englishLevel,
      reg.sessionTitle,
      reg.sessionDate.toLocaleDateString(),
      reg.sessionType,
      reg.status,
      reg.attended ? 'Yes' : 'No',
      reg.previousParticipation ? 'Yes' : 'No',
      reg.specialRequests || ''
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSession = filterSession === 'all' || registration.sessionId === filterSession
    const matchesStatus = filterStatus === 'all' || registration.status === filterStatus

    return matchesSearch && matchesSession && matchesStatus
  })

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getStats = () => {
    const total = filteredRegistrations.length
    const confirmed = filteredRegistrations.filter(r => r.status === 'confirmed').length
    const attended = filteredRegistrations.filter(r => r.attended).length
    const pending = filteredRegistrations.filter(r => r.status === 'pending').length

    return { total, confirmed, attended, pending }
  }

  const stats = getStats()

  if (loading) {
    return <LoadingSpinner text="Loading registrations..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registration Manager</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage participant registrations for sessions and events
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Registrations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.attended}</p>
              <p className="text-gray-600">Attended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Sessions/Events</option>
              <optgroup label="Sessions">
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} - {session.date.toLocaleDateString()}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Events">
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.date.toLocaleDateString()}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session/Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {registration.email}
                      </div>
                      {registration.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {registration.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {registration.sessionType === 'zoom' ? (
                        <Video className="w-4 h-4 text-blue-500 mr-2" />
                      ) : (
                        <MapPin className="w-4 h-4 text-green-500 mr-2" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {registration.sessionTitle}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {registration.sessionDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.university}</div>
                    <div className="text-sm text-gray-500">
                      {registration.major} - {registration.yearOfStudy} Year
                    </div>
                    <div className="text-sm text-gray-500">
                      English: {registration.englishLevel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(registration.status)}`}>
                        {registration.status}
                      </span>
                      <div>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={registration.attended}
                            onChange={(e) => markAttendance(registration.id, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                          />
                          Attended
                        </label>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.registrationDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration)
                          setShowDetailModal(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRegistration(registration.id, `${registration.firstName} ${registration.lastName}`)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <select
                        value={registration.status}
                        onChange={(e) => updateRegistrationStatus(registration.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Registration Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p>{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p>{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p>{selectedRegistration.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Telegram:</span>
                    <p>{selectedRegistration.telegram || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Academic Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">University:</span>
                    <p>{selectedRegistration.university}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Major:</span>
                    <p>{selectedRegistration.major}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year of Study:</span>
                    <p>{selectedRegistration.yearOfStudy}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">English Level:</span>
                    <p>{selectedRegistration.englishLevel}</p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Session/Event Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p>{selectedRegistration.sessionTitle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p>{selectedRegistration.sessionDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="flex items-center">
                      {selectedRegistration.sessionType === 'zoom' ? (
                        <>
                          <Video className="w-4 h-4 mr-1" />
                          Online (Zoom)
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-1" />
                          Offline
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Registration Date:</span>
                    <p>{selectedRegistration.registrationDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Previous Participation:</span>
                    <p>{selectedRegistration.previousParticipation ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Special Requests:</span>
                    <p>{selectedRegistration.specialRequests || 'None'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedRegistration.status)}`}>
                      {selectedRegistration.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Attended:</span>
                    <span className={`ml-2 ${selectedRegistration.attended ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedRegistration.attended ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  deleteRegistration(selectedRegistration.id, `${selectedRegistration.firstName} ${selectedRegistration.lastName}`)
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Delete Registration
              </button>
              <a
                href={`mailto:${selectedRegistration.email}?subject=BUSA Speaking Club - ${selectedRegistration.sessionTitle}`}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegistrationManager 