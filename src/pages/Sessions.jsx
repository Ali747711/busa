import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Clock, MapPin, Users, Video, Calendar as CalendarIcon, X, ExternalLink, User } from 'lucide-react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationModal from '../components/RegistrationModal'

const Sessions = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSession, setSelectedSession] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedSessionForRegistration, setSelectedSessionForRegistration] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      
      // Fetch upcoming sessions from Firebase
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc')
      )
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const sessionsData = sessionsSnapshot.docs.map(doc => {
        const data = doc.data()
        const sessionDate = data.date?.toDate() || new Date(data.date)
        
        return {
          id: doc.id,
          ...data,
          date: sessionDate,
          // Convert admin data format to sessions page format
          topic: data.title,
          facilitator: 'BUSA Mentor', // Default facilitator
          rsvpCount: data.currentAttendees || 0,
          maxCapacity: data.maxAttendees || 50,
          registrationStatus: data.registrationStatus || 'open',
          platform: data.type === 'zoom' ? 'Zoom' : 'In-Person',
          venue: data.location || 'TBA',
          address: data.location || 'Address will be shared closer to the event',
          time: sessionDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          duration: '90 minutes', // Default duration
          agenda: [
            'Welcome & Introduction',
            'Main Activity Session',
            'Group Discussion',
            'Q&A Session',
            'Wrap-up & Next Steps'
          ]
        }
      })
      
      setUpcomingEvents(sessionsData)
      
    } catch (error) {
      console.error('Error fetching sessions:', error)
      // Use demo data as fallback
      setUpcomingEvents([
        {
          id: 1,
          type: 'zoom',
          date: new Date('2024-12-15T14:00:00'),
          topic: 'Public Speaking Masterclass',
          platform: 'Zoom',
          time: '2:00 PM KST',
          duration: '90 minutes',
          facilitator: 'Aziz Karimov',
          description: 'Master the art of public speaking with confidence-building techniques and practical exercises.',
          rsvpCount: 28,
          maxCapacity: 50,
          registrationStatus: 'open',
          agenda: [
            'Introduction to Public Speaking',
            'Overcoming Stage Fright',
            'Structuring Your Speech',
            'Body Language and Voice',
            'Practice Session with Feedback'
          ]
        },
        {
          id: 2,
          type: 'zoom',
          date: new Date('2024-12-22T13:00:00'),
          topic: 'English Conversation Practice',
          platform: 'Zoom',
          time: '1:00 PM KST',
          duration: '2 hours',
          facilitator: 'Malika Uzbekova',
          description: 'Interactive conversation practice session focusing on everyday English topics.',
          rsvpCount: 35,
          maxCapacity: 45,
          registrationStatus: 'open',
          agenda: [
            'Welcome & Warm-up',
            'Topic Discussions',
            'Breakout Room Conversations',
            'Group Feedback Session',
            'Next Session Planning'
          ]
        },
        {
          id: 3,
          type: 'offline',
          date: new Date('2024-12-25T15:00:00'),
          topic: 'IELTS Speaking Workshop',
          platform: 'In-Person',
          venue: 'BUSA Office',
          address: 'Seoul, South Korea',
          time: '3:00 PM KST',
          duration: '2 hours',
          facilitator: 'Bekzod Tashkentov',
          description: 'Intensive IELTS speaking preparation with mock tests and personalized feedback.',
          rsvpCount: 15,
          maxCapacity: 20,
          registrationStatus: 'open',
          agenda: [
            'IELTS Speaking Format Overview',
            'Mock Interview Practice',
            'Common Topics & Strategies',
            'Individual Feedback Session',
            'Study Tips & Resources'
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return upcomingEvents.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
      const eventDateStr = eventDate.toISOString().split('T')[0]
      return eventDateStr === dateStr
    })
  }

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  // Handle session click
  const handleSessionClick = (session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  if (loading) {
    return (
      <div className="pt-36 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading sessions..." />
      </div>
    )
  }

  return (
    <div className="pt-36 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Speaking Sessions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our interactive sessions and practice your English speaking skills with fellow Uzbek students
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-16">
          {/* Calendar Section */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <CalendarIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">
                    Session Calendar
                  </h2>
                  <p className="text-gray-600">Click on dates to see available sessions</p>
                </div>
              </div>
              
              <div className="calendar-container mb-8">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  onClickDay={handleDateClick}
                  className="custom-calendar"
                  tileClassName={({ date }) => {
                    const events = getEventsForDate(date)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    date.setHours(0, 0, 0, 0)
                    
                    let classes = []
                    
                    if (date.getTime() === selectedDate.getTime()) {
                      classes.push('selected-date')
                    }
                    
                    if (date.getTime() === today.getTime()) {
                      classes.push('today-date')
                    }
                    
                    if (events.length > 0) {
                      // Check event types
                      const hasOnline = events.some(event => event.type === 'zoom')
                      const hasOffline = events.some(event => event.type !== 'zoom')
                      
                      if (hasOnline && hasOffline) {
                        // Mixed events on the same day
                        classes.push('has-mixed-events')
                      } else if (hasOnline) {
                        // Only online events
                        classes.push('has-online-events')
                      } else {
                        // Only offline events
                        classes.push('has-offline-events')
                      }
                    }
                    
                    return classes.join(' ')
                  }}
                  tileContent={({ date }) => {
                    const events = getEventsForDate(date)
                    if (events.length > 0) {
                      const hasOnline = events.some(event => event.type === 'zoom')
                      const hasOffline = events.some(event => event.type !== 'zoom')
                      
                      if (hasOnline && hasOffline) {
                        return <div className="event-indicator mixed-events"></div>
                      } else if (hasOnline) {
                        return <div className="event-indicator online-events"></div>
                      } else {
                        return <div className="event-indicator offline-events"></div>
                      }
                    }
                    return null
                  }}
                />
              </div>

              {/* Calendar Legend */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Online Session</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-secondary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Offline Event</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Mixed Events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-primary-200 rounded-full border-2 border-primary-500"></div>
                  <span className="text-sm text-gray-700">Selected Date</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-accent-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{upcomingEvents.length}</div>
                  <div className="text-sm text-gray-600">Upcoming Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">
                    {upcomingEvents.reduce((sum, event) => sum + event.rsvpCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">
                    {upcomingEvents.filter(e => e.type === 'zoom').length}
                  </div>
                  <div className="text-sm text-gray-600">Online Sessions</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Ready to Join?</h3>
              <p className="text-sm text-primary-100 mb-4">
                Register now to secure your spot in upcoming sessions
              </p>
              <button
                onClick={() => {
                  // Show next available session for registration
                  const nextSession = upcomingEvents.find(session => 
                    session.registrationStatus !== 'closed' && session.date > new Date()
                  )
                  if (nextSession) {
                    setSelectedSessionForRegistration(nextSession)
                    setShowRegistrationModal(true)
                  }
                }}
                disabled={!upcomingEvents.some(session => 
                  session.registrationStatus !== 'closed' && session.date > new Date()
                )}
                className="inline-block bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 text-center">
            Upcoming Sessions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
              >
                {/* Session Type Header */}
                <div className={`p-4 ${
                  session.type === 'zoom' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
                    : 'bg-gradient-to-r from-secondary-500 to-secondary-600'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {session.type === 'zoom' ? (
                        <Video className="w-5 h-5 mr-2" />
                      ) : (
                        <MapPin className="w-5 h-5 mr-2" />
                      )}
                      <span className="font-medium">
                        {session.type === 'zoom' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <span className="text-sm">
                      {new Date(session.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Session Content */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {session.topic}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{session.time}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{session.facilitator}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{session.rsvpCount}/{session.maxCapacity} attending</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          session.rsvpCount >= session.maxCapacity 
                            ? 'bg-red-500' 
                            : session.rsvpCount >= session.maxCapacity * 0.8
                            ? 'bg-yellow-500'
                            : session.type === 'zoom' ? 'bg-primary-500' : 'bg-secondary-500'
                        }`}
                        style={{ 
                          width: `${(session.rsvpCount / session.maxCapacity) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Registration Status Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.registrationStatus === 'open' && session.rsvpCount < session.maxCapacity
                        ? 'bg-green-100 text-green-800'
                        : session.registrationStatus === 'waitlist' || session.rsvpCount >= session.maxCapacity
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {session.registrationStatus === 'open' && session.rsvpCount < session.maxCapacity
                        ? '✓ Open Registration'
                        : session.registrationStatus === 'waitlist' || session.rsvpCount >= session.maxCapacity
                        ? '⏳ Waitlist Available'
                        : '🚫 Registration Closed'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleSessionClick(session)}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    {session.registrationStatus !== 'closed' && (
                      <button 
                        onClick={() => {
                          setSelectedSessionForRegistration(session)
                          setShowRegistrationModal(true)
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium text-white ${
                          session.registrationStatus === 'waitlist' || session.rsvpCount >= session.maxCapacity
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : session.type === 'zoom' 
                            ? 'bg-primary-600 hover:bg-primary-700' 
                            : 'bg-secondary-600 hover:bg-secondary-700'
                        }`}
                      >
                        {session.registrationStatus === 'waitlist' || session.rsvpCount >= session.maxCapacity
                          ? 'Waitlist'
                          : 'Register'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`p-6 ${
              selectedSession.type === 'zoom' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
                : 'bg-gradient-to-r from-secondary-500 to-secondary-600'
            } text-white rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {selectedSession.type === 'zoom' ? (
                    <Video className="w-6 h-6 mr-3" />
                  ) : (
                    <MapPin className="w-6 h-6 mr-3" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{selectedSession.topic}</h2>
                    <p className="text-white/80">
                      {selectedSession.type === 'zoom' ? 'Online Session' : 'Offline Event'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedSession.time}</div>
                        <div className="text-sm text-gray-600">{selectedSession.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Facilitator</div>
                        <div className="text-sm text-gray-600">{selectedSession.facilitator}</div>
                      </div>
                    </div>

                    {selectedSession.type === 'zoom' ? (
                      <div className="flex items-center">
                        <Video className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Platform</div>
                          <div className="text-sm text-gray-600">{selectedSession.platform}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Venue</div>
                          <div className="text-sm text-gray-600">{selectedSession.venue}</div>
                          <div className="text-sm text-gray-500">{selectedSession.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Attendance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Registered</span>
                      <span className="font-medium">{selectedSession.rsvpCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">{selectedSession.maxCapacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          selectedSession.type === 'zoom' ? 'bg-primary-500' : 'bg-secondary-500'
                        }`}
                        style={{ 
                          width: `${(selectedSession.rsvpCount / selectedSession.maxCapacity) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedSession.maxCapacity - selectedSession.rsvpCount} spots remaining
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">About This Session</h3>
                <p className="text-gray-700 leading-relaxed">{selectedSession.description}</p>
              </div>

              {/* Agenda */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Agenda</h3>
                <ul className="space-y-2">
                  {selectedSession.agenda.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full ${
                        selectedSession.type === 'zoom' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
                      } flex items-center justify-center text-sm font-medium mr-3`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Registration Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Registration Status</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedSession.registrationStatus === 'open' && selectedSession.rsvpCount < selectedSession.maxCapacity
                      ? 'bg-green-100 text-green-800'
                      : selectedSession.registrationStatus === 'waitlist' || selectedSession.rsvpCount >= selectedSession.maxCapacity
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSession.registrationStatus === 'open' && selectedSession.rsvpCount < selectedSession.maxCapacity
                      ? '✓ Open'
                      : selectedSession.registrationStatus === 'waitlist' || selectedSession.rsvpCount >= selectedSession.maxCapacity
                      ? '⏳ Waitlist'
                      : '🚫 Closed'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {selectedSession.registrationStatus === 'open' && selectedSession.rsvpCount < selectedSession.maxCapacity
                    ? 'Registration is currently open. Secure your spot now!'
                    : selectedSession.registrationStatus === 'waitlist' || selectedSession.rsvpCount >= selectedSession.maxCapacity
                    ? 'Session is full, but you can join the waitlist for potential openings.'
                    : 'Registration is currently closed for this session.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedSession.registrationStatus === 'closed' ? (
                  <button
                    disabled
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-gray-400 bg-gray-200 cursor-not-allowed"
                  >
                    Registration Closed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedSessionForRegistration(selectedSession)
                      setShowRegistrationModal(true)
                    }}
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                      selectedSession.registrationStatus === 'waitlist' || selectedSession.rsvpCount >= selectedSession.maxCapacity
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : selectedSession.type === 'zoom' 
                        ? 'bg-primary-600 hover:bg-primary-700' 
                        : 'bg-secondary-600 hover:bg-secondary-700'
                    }`}
                  >
                    {selectedSession.registrationStatus === 'waitlist' || selectedSession.rsvpCount >= selectedSession.maxCapacity
                      ? 'Join Waitlist'
                      : 'Register for Session'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false)
          setSelectedSessionForRegistration(null)
        }}
        session={selectedSessionForRegistration}
        type="session"
      />
    </div>
  )
}

export default Sessions 