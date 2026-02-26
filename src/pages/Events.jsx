import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Calendar, MapPin, Users, ExternalLink, Clock, Trophy, Star, Video } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationModal from '../components/RegistrationModal'

const Events = () => {
  const [events, setEvents] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventsAndSessions()
  }, [])

  const fetchEventsAndSessions = async () => {
    try {
      setLoading(true)
      
      // Fetch upcoming events from Event Manager
      const eventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc'),
        limit(6)
      )
      const eventsSnapshot = await getDocs(eventsQuery)
      const eventsData = eventsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(data.date)
        }
      })
      setEvents(eventsData)

      // Fetch upcoming sessions from Session Manager
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc'),
        limit(4)
      )
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const sessionsData = sessionsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(data.date)
        }
      })
      setUpcomingSessions(sessionsData)
      
    } catch (error) {
      console.error('Error fetching events and sessions:', error)
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
          registrationRequired: true,
          registrationLink: '/contact',
          photoUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500'
        }
      ])

      setUpcomingSessions([
        {
          id: '1',
          title: 'English Conversation Practice',
          description: 'Interactive conversation practice session.',
          date: new Date('2024-12-15T13:00:00'),
          type: 'zoom',
          maxAttendees: 45,
          currentAttendees: 35
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type) => {
    const colors = {
      competition: 'bg-red-500',
      workshop: 'bg-blue-500',
      networking: 'bg-green-500',
      social: 'bg-purple-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="pt-36 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading events..." />
      </div>
    )
  }

  return (
    <div className="pt-36 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Events & Sessions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community events, speaking sessions, and competitions to enhance your English skills and connect with fellow students.
          </p>
        </div>

        {/* Special Events Section */}
        {events.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Special Events
              </h2>
              <div className="flex items-center text-primary-600">
                <Trophy className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Limited Spots Available</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Event Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {event.photoUrl ? (
                      <img 
                        src={event.photoUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <Calendar className="w-16 h-16 text-primary-600" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                        <span>
                          {event.date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-3 text-primary-500" />
                        <span>
                          {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-3 text-primary-500" />
                        <span>{event.currentAttendees || 0}/{event.maxAttendees} registered</span>
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getEventTypeColor(event.type)}`}
                          style={{ 
                            width: `${Math.min((event.currentAttendees || 0) / event.maxAttendees * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.maxAttendees - (event.currentAttendees || 0)} spots remaining
                      </p>
                    </div>

                    {/* Registration button */}
                    {event.registrationStatus === 'closed' ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-gray-400 bg-gray-200 cursor-not-allowed"
                      >
                        Registration Closed
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedEventForRegistration(event)
                          setShowRegistrationModal(true)
                        }}
                        className={`w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-105 ${
                          event.registrationStatus === 'waitlist' || event.currentAttendees >= event.maxAttendees
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : getEventTypeColor(event.type)
                        } hover:opacity-90`}
                      >
                        {event.registrationStatus === 'waitlist' || event.currentAttendees >= event.maxAttendees
                          ? 'Join Waitlist'
                          : 'Register Now'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Sessions Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            Regular Sessions
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Online Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Video className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">Online Sessions</h3>
                  <p className="text-gray-600">3 times per month via Zoom</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {upcomingSessions.filter(session => session.type === 'zoom').slice(0, 2).map((session) => (
                  <div key={session.id} className="border-l-4 border-primary-500 pl-4 bg-primary-50 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {session.date.toLocaleDateString()} - {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500">{session.description}</p>
                    <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="text-sm text-primary-700">{session.currentAttendees || 0}/{session.maxAttendees} registered</span>
                    </div>
                  </div>
                ))}
                
                {upcomingSessions.filter(session => session.type === 'zoom').length === 0 && (
                  <div className="border-l-4 border-primary-300 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-700">Next Session TBA</h4>
                    <p className="text-gray-600 text-sm">Check back soon for upcoming online sessions</p>
                  </div>
                )}
              </div>

              <Link
                to="/sessions"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                View All Sessions
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Offline Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">Offline Events</h3>
                  <p className="text-gray-600">1 time per month in Seoul</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {upcomingSessions.filter(session => session.type === 'offline').slice(0, 2).map((session) => (
                  <div key={session.id} className="border-l-4 border-secondary-500 pl-4 bg-secondary-50 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {session.date.toLocaleDateString()} - {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500">{session.description}</p>
                    <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 mr-2 text-secondary-500" />
                      <span className="text-sm text-secondary-700">{session.currentAttendees || 0}/{session.maxAttendees} registered</span>
                    </div>
                  </div>
                ))}
                
                {upcomingSessions.filter(session => session.type === 'offline').length === 0 && (
                  <div className="border-l-4 border-secondary-300 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-700">Next Event TBA</h4>
                    <p className="text-gray-600 text-sm">Stay tuned for our next offline gathering</p>
                  </div>
                )}
              </div>

              <Link
                to="/sessions"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-secondary-600 hover:bg-secondary-700 transition-colors"
              >
                View Calendar
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on our upcoming events and sessions. Register now to secure your spot and start improving your English skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Show next available event for registration
                const nextEvent = events.find(event => 
                  event.registrationStatus !== 'closed' && event.date > new Date()
                )
                if (nextEvent) {
                  setSelectedEventForRegistration(nextEvent)
                  setShowRegistrationModal(true)
                }
              }}
              disabled={!events.some(event => 
                event.registrationStatus !== 'closed' && event.date > new Date()
              )}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register Today
            </button>
            <Link
              to="/sessions"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              View Schedule
            </Link>
          </div>
        </section>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false)
          setSelectedEventForRegistration(null)
        }}
        event={selectedEventForRegistration}
        type="event"
      />
    </div>
  )
}

export default Events 