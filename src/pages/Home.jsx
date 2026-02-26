import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Star } from 'lucide-react'
import { useSiteConfig } from '../contexts/SiteConfigContext'

const Home = () => {
  const [successStories, setSuccessStories] = useState([])
  const { config, loading: configLoading } = useSiteConfig()

  useEffect(() => {
    fetchSuccessStories()
  }, [])

  const fetchSuccessStories = async () => {
    try {
      const storiesQuery = query(
        collection(db, 'success-stories'),
        orderBy('createdAt', 'desc'),
        limit(3)
      )
      const storiesSnapshot = await getDocs(storiesQuery)
      const storiesData = storiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSuccessStories(storiesData)
    } catch (error) {
      console.error('Error fetching success stories:', error)
      // Use demo data as fallback
      setSuccessStories([
        {
          id: '1',
          studentName: 'Aziza Sultanova',
          university: 'Seoul National University',
          story: 'BUSA Speaking Club helped me gain confidence in presentations. I went from being scared to speak in class to leading discussions!',
          rating: 5,
          photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
          achievement: 'Won Best Presentation Award'
        },
        {
          id: '2', 
          studentName: 'Bekzod Tashkentov',
          university: 'Korea University',
          story: 'The debate sessions taught me critical thinking skills that I use in my studies and internships. Highly recommended!',
          rating: 5,
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          achievement: 'Secured Internship at Samsung'
        },
        {
          id: '3',
          studentName: 'Malika Karimova',
          university: 'Yonsei University', 
          story: 'I made amazing friends and improved my English fluency. BUSA is more than a club - it\'s a family!',
          rating: 5,
          photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
          achievement: 'IELTS Score 8.0'
        }
      ])
    }
  }

  // Show loading state while config is loading
  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Dynamic Hero Section with Firebase configuration */}
      <HeroSection 
        title={`${config.siteTitle}: Uzbek Voices in Korea`}
        subtitle={config.siteDescription}
        stats={[
          { value: "50+", label: "Active Members" },
          { value: "3x", label: "Monthly Zoom Sessions" },
          { value: "1x", label: "Monthly Offline Debate" }
        ]}
      />

      {/* Join Section - Target for smooth scroll */}
      <section id="join-section" className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Ready to Join {config.siteTitle}?
            </h2>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Take the first step towards improving your English and connecting with fellow Uzbek students in Korea.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Online Sessions</h3>
                <p className="text-red-100 mb-4">Join our interactive Zoom sessions 3 times per month</p>
                <ul className="text-red-100 text-left space-y-2">
                  <li>• Conversation practice</li>
                  <li>• Grammar workshops</li>
                  <li>• Public speaking training</li>
                  <li>• Cultural discussions</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Offline Debates</h3>
                <p className="text-red-100 mb-4">Monthly in-person debate competitions in Seoul</p>
                <ul className="text-red-100 text-left space-y-2">
                  <li>• Structured debates</li>
                  <li>• Critical thinking</li>
                  <li>• Networking events</li>
                  <li>• Prize competitions</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group bg-white text-primary-600 hover:bg-red-50 font-bold py-4 px-10 rounded-xl text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Register Now</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                to="/events"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-xl text-xl transition-all duration-300 hover:scale-105"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Why Choose {config.siteTitle}?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a supportive environment for Uzbek students to excel in English communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group hover:border-primary-200 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <svg className="w-10 h-10 text-primary-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Community Building</h3>
              <p className="text-gray-600 leading-relaxed">Connect with fellow Uzbek students studying in Korea and build lasting friendships through shared experiences.</p>
            </div>

            <div className="card text-center group hover:border-secondary-200 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300">
                <svg className="w-10 h-10 text-secondary-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Skill Development</h3>
              <p className="text-gray-600 leading-relaxed">Enhance your English speaking skills, critical thinking abilities, and public speaking confidence through structured activities.</p>
            </div>

            <div className="card text-center group hover:border-accent-200 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                <svg className="w-10 h-10 text-accent-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">Join our successful community where members have improved their academic performance and professional opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our members about their journey with {config.siteTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="card bg-white">
                <div className="flex items-center mb-4">
                  {story.photoUrl ? (
                    <img 
                      src={story.photoUrl} 
                      alt={story.studentName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {story.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{story.studentName}</h4>
                    <p className="text-sm text-gray-600">{story.university}</p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (story.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">({story.rating || 5}/5)</span>
                </div>
                
                <p className="text-gray-700 italic leading-relaxed">
                  "{story.story}"
                </p>
                
                {story.achievement && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✨ Achievement: {story.achievement}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {successStories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading success stories...</p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Your Speaking Journey Starts Here
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of Uzbek students who have transformed their communication skills and built meaningful connections through {config.siteTitle}.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 hover:bg-red-50 font-bold py-4 px-10 rounded-xl text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center space-x-3"
          >
            <span>Start Your Journey Today</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 