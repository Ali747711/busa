import { useState, useEffect } from 'react'
import { 
  Plus, 
  Minus,
  Edit2, 
  Trash2, 
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Search,
  X
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

const EventManager = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'workshop',
    location: '',
    maxAttendees: 50,
    currentAttendees: 0,
    registrationStatus: 'open',
    registrationRequired: true,
    registrationLink: '',
    photo: null,
    photoUrl: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(eventsQuery)
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date),
        currentAttendees: doc.data().currentAttendees || 0,
        registrationStatus: doc.data().registrationStatus || 'open'
      }))
      setEvents(eventsData)
    } catch (error) {
      console.error('Error fetching events:', error)
      // Use demo data as fallback
      setEvents([
        {
          id: '1',
          title: 'Annual Speaking Competition',
          description: 'Join our biggest event of the year! Compete with fellow students and showcase your speaking skills.',
          date: new Date('2024-12-25T14:00:00'),
          type: 'competition',
          location: 'Seoul National University Auditorium',
          maxAttendees: 200,
          currentAttendees: 156,
          registrationStatus: 'open',
          registrationRequired: true,
          registrationLink: 'https://forms.google.com/competition-registration',
          photoUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500',
          status: 'upcoming'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (file) => {
    if (!file) return ''
    
    try {
      setUploading(true)
      const timestamp = Date.now()
      const fileName = `events/${timestamp}_${file.name}`
      const storageRef = ref(storage, fileName)
      
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let photoUrl = formData.photoUrl
      
      // Upload new photo if selected
      if (formData.photo) {
        photoUrl = await handlePhotoUpload(formData.photo)
      }
      
      const eventData = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`),
        photoUrl,
        createdAt: new Date(),
        status: 'upcoming',
        currentAttendees: 0
      }
      
      // Remove photo file from data before saving
      delete eventData.photo

      if (editingEvent) {
        await updateDoc(doc(db, 'events', editingEvent.id), eventData)
      } else {
        await addDoc(collection(db, 'events'), eventData)
      }
      
      await fetchEvents()
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event. Please try again.')
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split('T')[0],
      time: event.date.toTimeString().split(' ')[0].substring(0, 5),
      type: event.type,
      location: event.location || '',
      maxAttendees: event.maxAttendees || 50,
      currentAttendees: event.currentAttendees || 0,
      registrationStatus: event.registrationStatus || 'open',
      registrationRequired: event.registrationRequired || false,
      registrationLink: event.registrationLink || '',
      photo: null,
      photoUrl: event.photoUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      await deleteDoc(doc(db, 'events', eventId))
      await fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
      setEvents(events.filter(e => e.id !== eventId))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'workshop',
      location: '',
      maxAttendees: 50,
      currentAttendees: 0,
      registrationStatus: 'open',
      registrationRequired: true,
      registrationLink: '',
      photo: null,
      photoUrl: ''
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const updateAttendeeCount = async (eventId, change) => {
    try {
      const event = events.find(e => e.id === eventId)
      const newCount = Math.max(0, Math.min(event.maxAttendees, event.currentAttendees + change))
      
      await updateDoc(doc(db, 'events', eventId), {
        currentAttendees: newCount
      })
      
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, currentAttendees: newCount } : e
      ))
    } catch (error) {
      console.error('Error updating attendee count:', error)
      // Update locally if Firebase fails
      setEvents(events.map(e => 
        e.id === eventId ? { 
          ...e, 
          currentAttendees: Math.max(0, Math.min(e.maxAttendees, e.currentAttendees + change))
        } : e
      ))
    }
  }

  const updateRegistrationStatus = async (eventId, status) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        registrationStatus: status
      })
      
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, registrationStatus: status } : e
      ))
    } catch (error) {
      console.error('Error updating registration status:', error)
      // Update locally if Firebase fails
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, registrationStatus: status } : e
      ))
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || event.type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner text="Loading events..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Manager</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage community events, workshops, and competitions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
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
                placeholder="Search events..."
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
              <option value="workshop">Workshops</option>
              <option value="competition">Competitions</option>
              <option value="networking">Networking</option>
              <option value="social">Social Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Event Image */}
            <div className="h-48 bg-gray-200 relative">
              {event.photoUrl ? (
                <img 
                  src={event.photoUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                  <CalendarIcon className="w-16 h-16 text-primary-600" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  event.type === 'competition' ? 'bg-red-100 text-red-800' :
                  event.type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'networking' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.type}
                </span>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {event.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{event.location}</span>
                </div>
                
              </div>

              {/* Attendee Management */}
              <div className="space-y-3 mb-4">
                {/* Attendee Counter with Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.currentAttendees || 0}/{event.maxAttendees} attendees</span>
                  </div>
                  
                  {/* Counter Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateAttendeeCount(event.id, -1)}
                      disabled={event.currentAttendees <= 0}
                      className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                      title="Remove attendee"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateAttendeeCount(event.id, 1)}
                      disabled={event.currentAttendees >= event.maxAttendees}
                      className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                      title="Add attendee"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      event.currentAttendees >= event.maxAttendees 
                        ? 'bg-red-500' 
                        : event.currentAttendees >= event.maxAttendees * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (event.currentAttendees / event.maxAttendees) * 100)}%` 
                    }}
                  />
                </div>
                
                {/* Registration Status */}
                <div className="flex items-center justify-between">
                  <select
                    value={event.registrationStatus || 'open'}
                    onChange={(e) => updateRegistrationStatus(event.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="open">Open</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.registrationStatus === 'open'
                      ? 'bg-green-100 text-green-800'
                      : event.registrationStatus === 'waitlist'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.registrationStatus === 'open' ? '✓ Open' :
                     event.registrationStatus === 'waitlist' ? '⏳ Waitlist' : '🚫 Closed'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="networking">Networking</option>
                    <option value="social">Social Event</option>
                  </select>
                </div>

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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Seoul National University Auditorium"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Registration Link</label>
                  <input
                    type="url"
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({...formData, registrationLink: e.target.value})}
                    placeholder="https://forms.google.com/..."
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Event Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.photoUrl && (
                    <div className="mt-2">
                      <img src={formData.photoUrl} alt="Current" className="w-32 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.registrationRequired}
                      onChange={(e) => setFormData({...formData, registrationRequired: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Registration required</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManager 