import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, MapPin, Video } from 'lucide-react'
import { addDoc, collection, updateDoc, doc, increment } from 'firebase/firestore'
import { db } from '../config/firebase'

const RegistrationModal = ({ 
  isOpen, 
  onClose, 
  session = null, 
  event = null,
  type = 'session' // 'session' or 'event'
}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegram: '',
    university: '',
    major: '',
    yearOfStudy: '',
    englishLevel: '',
    previousParticipation: 'no',
    specialRequests: ''
  })

  const item = session || event
  const itemType = type
  const collectionName = type === 'session' ? 'sessions' : 'events'

  if (!isOpen || !item) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create registration record
      const registrationData = {
        // Personal Information
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        telegram: formData.telegram.trim(),
        
        // Academic Information
        university: formData.university.trim(),
        major: formData.major.trim(),
        yearOfStudy: formData.yearOfStudy,
        englishLevel: formData.englishLevel,
        
        // Session/Event Context
        sessionId: item.id,
        sessionTitle: item.title || item.topic,
        sessionDate: item.date,
        sessionType: item.type,
        itemType: itemType, // 'session' or 'event'
        
        // Additional Info
        previousParticipation: formData.previousParticipation,
        specialRequests: formData.specialRequests.trim(),
        
        // Meta Information
        registrationDate: new Date(),
        status: 'confirmed',
        attended: false
      }

      // Add to registrations collection (no authentication required)
      await addDoc(collection(db, 'registrations'), registrationData)

      // Update attendee count (no authentication required for this field)
      await updateDoc(doc(db, collectionName, item.id), {
        currentAttendees: increment(1)
      })

      setSuccess(true)
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
        resetForm()
      }, 2000)

    } catch (error) {
      console.error('Error submitting registration:', error)
      let errorMessage = 'Registration failed. Please try again.'
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your connection and try again.'
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.'
      } else if (error.message.includes('Missing or insufficient permissions')) {
        errorMessage = 'Authentication issue. Please refresh the page and try again.'
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegram: '',
      university: '',
      major: '',
      yearOfStudy: '',
      englishLevel: '',
      previousParticipation: 'no',
      specialRequests: ''
    })
  }

  const handleClose = () => {
    onClose()
    if (!success) resetForm()
  }

  // Get registration status text
  const getRegistrationStatusText = () => {
    if (item.registrationStatus === 'closed') {
      return { text: 'Registration Closed', color: 'text-red-600' }
    }
    if (item.currentAttendees >= item.maxAttendees || item.registrationStatus === 'waitlist') {
      return { text: 'Joining Waitlist', color: 'text-yellow-600' }
    }
    return { text: 'Register Now', color: 'text-green-600' }
  }

  const statusInfo = getRegistrationStatusText()

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for registering for <strong>{item.title || item.topic}</strong>. 
            You'll receive a confirmation email shortly.
          </p>
          <div className="text-sm text-gray-500">
            This window will close automatically...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 ${
          item.type === 'zoom' 
            ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
            : 'bg-gradient-to-r from-secondary-500 to-secondary-600'
        } text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {item.type === 'zoom' ? (
                <Video className="w-6 h-6 mr-3" />
              ) : (
                <MapPin className="w-6 h-6 mr-3" />
              )}
              <div>
                <h2 className="text-xl font-bold">{item.title || item.topic}</h2>
                <p className="text-white/80 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {item.date?.toLocaleDateString()} at {item.date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Registration Status */}
          <div className="mt-4 flex items-center justify-between bg-white/10 rounded-lg p-3">
            <div>
              <div className="text-sm font-medium">Capacity</div>
              <div className="text-sm text-white/80">
                {item.currentAttendees || 0} / {item.maxAttendees} registered
              </div>
            </div>
            <div className={`text-sm font-semibold ${statusInfo.color.replace('text-', 'text-white')}`}>
              {statusInfo.text}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your last name"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+82 10 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Seoul National University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study *
                  </label>
                  <select
                    required
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="graduate">Graduate Student</option>
                    <option value="phd">PhD Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Level *
                  </label>
                  <select
                    required
                    value={formData.englishLevel}
                    onChange={(e) => setFormData({...formData, englishLevel: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="native">Native/Fluent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.previousParticipation === 'yes'}
                    onChange={(e) => setFormData({...formData, previousParticipation: e.target.checked ? 'yes' : 'no'})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I have participated in BUSA speaking sessions before
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests or Comments
                </label>
                <textarea
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any dietary restrictions, accessibility needs, or questions..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || item.registrationStatus === 'closed'}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                item.registrationStatus === 'closed'
                  ? 'bg-gray-400'
                  : item.currentAttendees >= item.maxAttendees || item.registrationStatus === 'waitlist'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {loading ? 'Submitting...' : 
               item.registrationStatus === 'closed' ? 'Registration Closed' :
               item.currentAttendees >= item.maxAttendees || item.registrationStatus === 'waitlist' ? 'Join Waitlist' : 
               'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationModal 