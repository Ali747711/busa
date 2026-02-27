import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMentorAccounts } from '../utils/createMentorAccounts'
import { CheckCircle, AlertCircle, Users, Key, Plus, Trash2, Eye, EyeOff, Mail, User } from 'lucide-react'

const Setup = () => {
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [results, setResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [showPasswords, setShowPasswords] = useState({})
  const [countdown, setCountdown] = useState(5)

  // After setup, Firebase has signed us in as the last created mentor.
  // Redirect to /login so the root manager can sign back in.
  useEffect(() => {
    if (!isComplete) return
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isComplete, navigate])

  // Initial mentor data (can be customized)
  const [mentorCredentials, setMentorCredentials] = useState([
    {
      id: 1,
      email: 'aziz.karimov@busa.kr',
      password: 'BusaMentor2024!',
      name: 'Aziz Karimov'
    },
    {
      id: 2,
      email: 'malika.uzbekova@busa.kr', 
      password: 'BusaMentor2024!',
      name: 'Malika Uzbekova'
    },
    {
      id: 3,
      email: 'bekzod.tashkentov@busa.kr',
      password: 'BusaMentor2024!',
      name: 'Bekzod Tashkentov'
    },
    {
      id: 4,
      email: 'admin@busa.kr',
      password: 'BusaAdmin2024!',
      name: 'BUSA Admin'
    }
  ])

  const handleCreateAccounts = async () => {
    setIsCreating(true)
    setResults([])
    
    try {
      const accountResults = await createMentorAccounts(mentorCredentials)
      setResults(accountResults)
      
      // Check if all accounts were created successfully
      const hasErrors = accountResults.some(result => result.type === 'error')
      if (!hasErrors) {
        setIsComplete(true)
      }
    } catch (error) {
      setResults([{ type: 'error', message: `General error: ${error.message}` }])
    }
    
    setIsCreating(false)
  }

  const updateMentor = (id, field, value) => {
    setMentorCredentials(prev => 
      prev.map(mentor => 
        mentor.id === id ? { ...mentor, [field]: value } : mentor
      )
    )
  }

  const addMentor = () => {
    const newId = Math.max(...mentorCredentials.map(m => m.id)) + 1
    setMentorCredentials(prev => [...prev, {
      id: newId,
      email: '',
      password: 'BusaMentor2024!',
      name: ''
    }])
  }

  const removeMentor = (id) => {
    if (mentorCredentials.length <= 1) {
      alert('You need at least one mentor account')
      return
    }
    setMentorCredentials(prev => prev.filter(mentor => mentor.id !== id))
  }

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const generateStrongPassword = (id) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    updateMentor(id, 'password', password)
  }

  const isFormValid = () => {
    return mentorCredentials.every(mentor => 
      mentor.email.trim() && 
      mentor.password.trim() && 
      mentor.name.trim() &&
      mentor.email.includes('@')
    )
  }

  return (
    <div className="pt-36 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔧 BUSA Admin Setup
          </h1>
          <p className="text-lg text-gray-600">
            Customize and create mentor accounts for your admin dashboard
          </p>
        </div>

        {/* Sign-out warning */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Important: You will be signed out</h3>
              <p className="text-sm text-amber-700 mt-1">
                Firebase signs you in as each new mentor while creating accounts. After setup
                completes you will be automatically redirected to the login page — sign back in
                as the root manager to access the admin dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Setup Instructions</h3>
              <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                <li>Customize email addresses, passwords, and names below</li>
                <li>Add or remove mentors as needed</li>
                <li>Use strong passwords (8+ characters with mixed case, numbers, symbols)</li>
                <li>Click "Create All Accounts" when ready</li>
                <li>Share credentials securely with each mentor</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customizable Mentor Credentials */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Mentor Accounts ({mentorCredentials.length})
            </h2>
            <button
              onClick={addMentor}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Mentor
            </button>
          </div>
          
          <div className="space-y-6">
            {mentorCredentials.map((mentor, index) => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mentor #{index + 1}
                  </h3>
                  {mentorCredentials.length > 1 && (
                    <button
                      onClick={() => removeMentor(mentor.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove mentor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={mentor.name}
                      onChange={(e) => updateMentor(mentor.id, 'name', e.target.value)}
                      placeholder="Enter mentor name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={mentor.email}
                      onChange={(e) => updateMentor(mentor.id, 'email', e.target.value)}
                      placeholder="mentor@busa.kr"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Key className="w-4 h-4 inline mr-1" />
                      Password
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPasswords[mentor.id] ? 'text' : 'password'}
                          value={mentor.password}
                          onChange={(e) => updateMentor(mentor.id, 'password', e.target.value)}
                          placeholder="Enter secure password"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(mentor.id)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords[mentor.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => generateStrongPassword(mentor.id)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Generate
                      </button>
                    </div>
                    {mentor.password && (
                      <div className="mt-1 text-xs text-gray-500">
                        Length: {mentor.password.length} | 
                        Strength: {mentor.password.length >= 8 && /[A-Z]/.test(mentor.password) && /[a-z]/.test(mentor.password) && /\d/.test(mentor.password) ? 
                          <span className="text-green-600">Strong</span> : 
                          <span className="text-orange-600">Weak</span>
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Accounts Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Accounts</h2>
          
          {!isComplete ? (
            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Ready to create {mentorCredentials.length} mentor account{mentorCredentials.length !== 1 ? 's' : ''}
                </div>
                {!isFormValid() && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    ⚠️ Please fill in all fields with valid information before creating accounts
                  </div>
                )}
              </div>
              
              <button
                onClick={handleCreateAccounts}
                disabled={isCreating || !isFormValid()}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isCreating ? 'Creating Accounts...' : `Create ${mentorCredentials.length} Mentor Account${mentorCredentials.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Setup Complete!</h3>
              <p className="text-green-600 mb-3">All mentor accounts have been created successfully.</p>
              <p className="text-sm text-gray-500">
                Redirecting to login in <span className="font-semibold">{countdown}</span>s — sign back in as the root manager.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-3 text-sm text-primary-600 underline hover:text-primary-800"
              >
                Go to login now
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Creation Results</h2>
            
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm border ${
                    result.type === 'error' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  <div className="font-medium">{result.email || 'General'}</div>
                  <div>{result.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credentials Summary */}
        {isComplete && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Mentor Credentials Summary
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Share these credentials securely with each mentor:
            </p>
            
            <div className="space-y-3">
              {mentorCredentials.map((mentor, index) => (
                <div key={mentor.id} className="bg-gray-50 p-3 rounded border">
                  <div className="font-medium text-gray-900">{mentor.name}</div>
                  <div className="text-sm text-gray-600">Email: {mentor.email}</div>
                  <div className="text-sm text-gray-600">Password: {mentor.password}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Share the credentials securely with each mentor (use encrypted messaging)</li>
            <li>Have mentors test login at <code className="bg-blue-100 px-2 py-1 rounded">/login</code></li>
            <li>Verify admin access works at <code className="bg-blue-100 px-2 py-1 rounded">/admin</code></li>
            <li>Recommend mentors change passwords after first login</li>
            <li>Delete this setup page and utility files after completion</li>
            <li>Set up Firebase security rules in production</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Test Login Page
          </a>
          <a
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

export default Setup 