import { useState, useEffect } from 'react'
import { 
  Plus, 
  Minus,
  Edit2, 
  Trash2, 
  Video, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

const SessionManager = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'zoom',
    location: '',
    zoomLink: '',
    maxAttendees: 50,
    currentAttendees: 0,
    registrationStatus: 'open' // open, closed, waitlist
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const sessionsQuery = query(
        collection(db, 'sessions'),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(sessionsQuery)
      const sessionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date),
        currentAttendees: doc.data().currentAttendees || 0,
        registrationStatus: doc.data().registrationStatus || 'open'
      }))
      setSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      // Use demo data as fallback
      setSessions([
        {
          id: '1',
          title: 'Advanced Speaking Techniques',
          description: 'Learn advanced techniques for public speaking',
          date: new Date('2024-12-15T14:00:00'),
          type: 'zoom',
          location: 'Zoom Meeting',
          zoomLink: 'https://zoom.us/j/123456789',
          maxAttendees: 50,
          currentAttendees: 45,
          registrationStatus: 'open',
          status: 'upcoming'
        },
        {
          id: '2',
          title: 'Monthly Debate Session',
          description: 'Practice debating skills in a friendly environment',
          date: new Date('2024-12-20T15:00:00'),
          type: 'offline',
          location: 'Seoul National University, Room 304',
          maxAttendees: 30,
          currentAttendees: 28,
          registrationStatus: 'open',
          status: 'upcoming'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const sessionData = {
      ...formData,
      date: new Date(`${formData.date}T${formData.time}`),
      createdAt: new Date(),
      status: 'upcoming',
      currentAttendees: 0
    }

    try {
      if (editingSession) {
        await updateDoc(doc(db, 'sessions', editingSession.id), sessionData)
      } else {
        await addDoc(collection(db, 'sessions'), sessionData)
      }
      
      await fetchSessions()
      resetForm()
    } catch (error) {
      console.error('Error saving session:', error)
      // For demo, just update local state
      if (editingSession) {
        setSessions(sessions.map(s => 
          s.id === editingSession.id 
            ? { ...s, ...sessionData, date: new Date(`${formData.date}T${formData.time}`) }
            : s
        ))
      } else {
        const newSession = {
          id: Date.now().toString(),
          ...sessionData,
          date: new Date(`${formData.date}T${formData.time}`),
          currentAttendees: 0,
          status: 'upcoming'
        }
        setSessions([newSession, ...sessions])
      }
      resetForm()
    }
  }

  const handleEdit = (session) => {
    setEditingSession(session)
    setFormData({
      title: session.title,
      description: session.description,
      date: session.date.toISOString().split('T')[0],
      time: session.date.toTimeString().split(' ')[0].substring(0, 5),
      type: session.type,
      location: session.location || '',
      zoomLink: session.zoomLink || '',
      maxAttendees: session.maxAttendees || 50,
      currentAttendees: session.currentAttendees || 0,
      registrationStatus: session.registrationStatus || 'open'
    })
    setShowForm(true)
  }

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return
    
    try {
      await deleteDoc(doc(db, 'sessions', sessionId))
      await fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      // For demo, just update local state
      setSessions(sessions.filter(s => s.id !== sessionId))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'zoom',
      location: '',
      zoomLink: '',
      maxAttendees: 50,
      currentAttendees: 0,
      registrationStatus: 'open'
    })
    setEditingSession(null)
    setShowForm(false)
  }

  const updateAttendeeCount = async (sessionId, change) => {
    try {
      const session = sessions.find(s => s.id === sessionId)
      const newCount = Math.max(0, Math.min(session.maxAttendees, session.currentAttendees + change))
      
      await updateDoc(doc(db, 'sessions', sessionId), {
        currentAttendees: newCount
      })
      
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, currentAttendees: newCount } : s
      ))
    } catch (error) {
      console.error('Error updating attendee count:', error)
      // Update locally if Firebase fails
      setSessions(sessions.map(s => 
        s.id === sessionId ? { 
          ...s, 
          currentAttendees: Math.max(0, Math.min(s.maxAttendees, s.currentAttendees + change))
        } : s
      ))
    }
  }

  const updateRegistrationStatus = async (sessionId, status) => {
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        registrationStatus: status
      })
      
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, registrationStatus: status } : s
      ))
    } catch (error) {
      console.error('Error updating registration status:', error)
      // Update locally if Firebase fails
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, registrationStatus: status } : s
      ))
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || session.type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner text="Loading sessions..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session Manager</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage speaking sessions and events
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </button>
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
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="zoom">Zoom Sessions</option>
              <option value="offline">Offline Sessions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {session.date.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {session.type === 'zoom' ? (
                        <>
                          <Video className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                            Zoom
                          </span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            Offline
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {/* Attendee Counter */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {session.currentAttendees || 0}/{session.maxAttendees}
                          </span>
                        </div>
                        
                        {/* Counter Controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateAttendeeCount(session.id, -1)}
                            disabled={session.currentAttendees <= 0}
                            className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Remove attendee"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateAttendeeCount(session.id, 1)}
                            disabled={session.currentAttendees >= session.maxAttendees}
                            className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Add attendee"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Registration Status */}
                      <div className="flex items-center">
                        <select
                          value={session.registrationStatus || 'open'}
                          onChange={(e) => updateRegistrationStatus(session.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="open">Open</option>
                          <option value="waitlist">Waitlist</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            session.currentAttendees >= session.maxAttendees 
                              ? 'bg-red-500' 
                              : session.currentAttendees >= session.maxAttendees * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (session.currentAttendees / session.maxAttendees) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        session.date > new Date() 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.date > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                      
                      {/* Registration Status Badge */}
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          session.registrationStatus === 'open'
                            ? 'bg-green-100 text-green-800'
                            : session.registrationStatus === 'waitlist'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {session.registrationStatus === 'open' ? '✓ Open' :
                           session.registrationStatus === 'waitlist' ? '⏳ Waitlist' : '🚫 Closed'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingSession ? 'Edit Session' : 'Create New Session'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="zoom">Zoom Session</option>
                  <option value="offline">Offline Session</option>
                </select>
              </div>

              {formData.type === 'zoom' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zoom Link</label>
                  <input
                    type="url"
                    value={formData.zoomLink}
                    onChange={(e) => setFormData({...formData, zoomLink: e.target.value})}
                    placeholder="https://zoom.us/j/..."
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Seoul National University, Room 304"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Attendees</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.maxAttendees}
                    value={formData.currentAttendees}
                    onChange={(e) => setFormData({...formData, currentAttendees: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Status</label>
                <select
                  value={formData.registrationStatus}
                  onChange={(e) => setFormData({...formData, registrationStatus: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="open">Open - Accepting new registrations</option>
                  <option value="waitlist">Waitlist - Full, but accepting waitlist</option>
                  <option value="closed">Closed - No more registrations</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  {editingSession ? 'Update' : 'Create'} Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionManager 