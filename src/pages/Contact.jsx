import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Mail, Phone, MessageCircle, ExternalLink, Calendar, Users } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationModal from '../components/RegistrationModal'

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    email: 'busa.speak@gmail.com',
    telegram: '@busa_speak',
    googleFormUrl: 'https://forms.google.com/your-form-id',
    phone: '+82-10-1234-5678'
  })
  const [loading, setLoading] = useState(true)
  const [nextSession, setNextSession] = useState(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationLoading, setRegistrationLoading] = useState(false)

  useEffect(() => {
    fetchContactInfo()
    fetchNextSession()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const contactSnapshot = await getDocs(collection(db, 'siteConfig'))
      if (!contactSnapshot.empty) {
        const contactData = contactSnapshot.docs[0].data()
        setContactInfo(prev => ({ ...prev, ...contactData }))
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNextSession = async () => {
    try {
      setRegistrationLoading(true)
      
      // Simplified query to avoid composite index requirement
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc')
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      
      // Filter in JavaScript to find the first available session
      const availableSession = sessionsSnapshot.docs.find(doc => {
        const data = doc.data()
        return data.registrationStatus !== 'closed' && 
               (data.currentAttendees || 0) < (data.maxAttendees || 50)
      })
      
      if (availableSession) {
        const sessionData = availableSession.data()
        const sessionDate = sessionData.date?.toDate() || new Date(sessionData.date)
        
        setNextSession({
          id: availableSession.id,
          ...sessionData,
          date: sessionDate,
          topic: sessionData.title,
          facilitator: 'BUSA Mentor',
          rsvpCount: sessionData.currentAttendees || 0,
          maxCapacity: sessionData.maxAttendees || 50,
          platform: sessionData.type === 'zoom' ? 'Zoom' : 'In-Person',
          venue: sessionData.location || 'TBA',
          time: sessionDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          duration: '90 minutes',
        })
      }
    } catch (error) {
      console.error('Error fetching next session:', error)
    } finally {
      setRegistrationLoading(false)
    }
  }

  const handleRegisterClick = () => {
    if (nextSession && nextSession.id) {
      setShowRegistrationModal(true)
    } else {
      // Fallback to Google Form if no sessions available
      const formUrl = contactInfo.googleFormUrl && contactInfo.googleFormUrl !== 'https://forms.google.com/your-form-id' 
        ? contactInfo.googleFormUrl 
        : 'https://forms.gle/example' // Fallback URL
      
      try {
        window.open(formUrl, '_blank')
      } catch (error) {
        console.error('Error opening Google Form:', error)
        alert('Registration form temporarily unavailable. Please contact us directly via email or Telegram.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading contact information..." />
      </div>
    )
  }

  return (
    <div className="pt-36 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Ready to improve your English speaking skills? Join our community today.
          </p>
        </div>

        {/* Registration Box */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              Join BUSA Speaking Club
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {nextSession 
                ? `Register for our next session and become a member. We'll contact you with all the details.`
                : `Fill out our registration form to become a member. We'll contact you with session details and next steps.`
              }
            </p>

            {/* Next Session Preview */}
            {nextSession && !registrationLoading && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Next Available Session:</h3>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{nextSession.date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {nextSession.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-secondary-500" />
                      <span>{nextSession.rsvpCount}/{nextSession.maxCapacity} registered</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mt-2">{nextSession.topic}</h4>
                  <p className="text-sm text-gray-600">Platform: {nextSession.platform}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Weekly speaking practice sessions
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Personalized feedback from mentors
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Exclusive events and workshops
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Networking with Uzbek students
                  </div>
                </div>
              </div>
            )}

            {registrationLoading && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
                <LoadingSpinner text="Loading next session..." />
              </div>
            )}

            {!nextSession && !registrationLoading && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">What you'll get:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Weekly speaking practice sessions
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Personalized feedback from mentors
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Exclusive events and workshops
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Networking with Uzbek students
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleRegisterClick}
              disabled={registrationLoading}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registrationLoading ? (
                'Loading...'
              ) : nextSession ? (
                <>
                  Register for Session
                  <Calendar className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              ) : (
                <>
                  Register Now
                  <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4">
              {nextSession 
                ? `Registration for ${nextSession.topic} closes when session is full or 24 hours before start time.`
                : 'Registration is completely free. We\'ll contact you within 24 hours.'
              }
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                {contactInfo.email}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Send us an email for inquiries
              </p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                {contactInfo.phone}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Call us during business hours
              </p>
            </div>

            {/* Telegram */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Telegram</h3>
              <a 
                href={`https://t.me/${contactInfo.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                {contactInfo.telegram}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Quick response via Telegram
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a membership fee?</h3>
              <p className="text-gray-600">
                No, BUSA Speaking Club is completely free for all Uzbek students studying in Korea.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What's the time commitment?</h3>
              <p className="text-gray-600">
                We recommend attending at least one session per week, but you can participate as much as your schedule allows.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Do I need advanced English skills?</h3>
              <p className="text-gray-600">
                Not at all! We welcome students of all English proficiency levels, from beginner to advanced.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Where do sessions take place?</h3>
              <p className="text-gray-600">
                Sessions are held at various locations around Seoul. Specific locations are shared with registered members.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do I get updates about sessions?</h3>
              <p className="text-gray-600">
                Once you register, you'll be added to our Telegram group where we share all session updates, schedules, and important announcements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        session={nextSession}
        type="session"
      />
    </div>
  )
}

export default Contact 