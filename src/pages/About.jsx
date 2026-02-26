import { Link } from 'react-router-dom'
import { Users, MessageCircle, Trophy, Heart, Target, Globe } from 'lucide-react'

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            About BUSA
            speaking club
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 leading-relaxed max-w-3xl mx-auto">
            Empowering Uzbek students in Korea through communication, community, and confidence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            BUSA Speaking Club is dedicated to creating a supportive environment where 
            <span className="text-primary-600 font-semibold"> Uzbek students in South Korea</span> can 
            improve their English communication skills, build meaningful connections, and thrive 
            academically and professionally.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-12">
            What We Stand For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Building bridges between Uzbek students, creating a supportive network that feels like home.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <MessageCircle className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">Communicate</h3>
              <p className="text-gray-600 leading-relaxed">
                Developing confident English skills through practice, debates, and speaking opportunities.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                <Trophy className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">Succeed</h3>
              <p className="text-gray-600 leading-relaxed">
                Achieving academic and professional success through improved communication and community support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">
                Why Choose BUSA Speaking Club?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cultural Understanding</h3>
                    <p className="text-gray-600">We understand the unique challenges faced by Uzbek students in Korea and provide culturally sensitive support.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Focused Approach</h3>
                    <p className="text-gray-600">Our sessions are specifically designed to improve English communication skills for academic and professional success.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community Network</h3>
                    <p className="text-gray-600">Connect with fellow Uzbek students across multiple Korean universities and build lasting friendships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Our Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">5+</div>
                  <div className="text-sm text-gray-600">Universities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-700 mb-2">3</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold text-primary-600">95%</span> of our members report 
                  improved confidence in English communication within their first month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your journey toward confident English communication and meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Join BUSA Today
            </Link>
            <Link
              to="/sessions"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              View Sessions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 