import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Mail, MessageCircle, Linkedin, MapPin, GraduationCap, User } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Mentors = () => {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMentors()
  }, [])

  const fetchMentors = async () => {
    try {
      const mentorsSnapshot = await getDocs(collection(db, 'mentors'))
      const mentorsData = mentorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMentors(mentorsData)
    } catch (error) {
      console.error('Error fetching mentors:', error)
      // Fallback to demo data
      setMentors([
        {
          id: '1',
          name: 'Aziz Karimov',
          role: 'Lead Mentor',
          university: 'Seoul National University',
          major: 'Business Administration',
          bio: 'Passionate about helping Uzbek students develop their speaking skills and confidence.',
          email: 'aziz.karimov@busa.kr',
          telegram: '@aziz_mentor'
        },
        {
          id: '2',
          name: 'Malika Uzbekova',
          role: 'Senior Mentor',
          university: 'Yonsei University',
          major: 'International Relations',
          bio: 'Experienced in debate coaching and public speaking training.',
          email: 'malika.uzbekova@busa.kr',
          telegram: '@malika_mentor'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading mentors..." />
      </div>
    )
  }

  return (
    <div className="pt-36 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-6">
            Our Experienced Mentors
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Meet our dedicated team of mentors who are passionate about helping you develop 
            your English speaking skills and communication confidence.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Profile Image */}
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                {mentor.photo ? (
                  <img 
                    src={mentor.photo} 
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">{mentor.role}</p>
                </div>

                {/* University & Major */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2 text-primary-500" />
                    <span className="text-sm">{mentor.university}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    <span className="text-sm">{mentor.major}</span>
                  </div>
                </div>

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {mentor.bio}
                  </p>
                )}

                {/* Contact Links */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
                  {mentor.email && (
                    <a
                      href={`mailto:${mentor.email}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all duration-200"
                      title={`Email ${mentor.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  
                  {mentor.telegram && (
                    <a
                      href={`https://t.me/${mentor.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all duration-200"
                      title={`Telegram ${mentor.name}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all duration-200"
                      title={`LinkedIn ${mentor.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No mentors message */}
        {mentors.length === 0 && (
          <div className="text-center py-16">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Mentors will appear here once they're added by administrators.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Ready to Start Your Speaking Journey?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our mentors are here to guide you every step of the way. Join our speaking club 
            and start building your confidence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200"
            >
              Get in Touch
            </a>
            <a
              href="/sessions"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              View Sessions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentors 