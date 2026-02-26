import { useState, useEffect } from 'react'
import { 
  Save, 
  Edit3, 
  Plus, 
  Trash2, 
  Upload,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  Star,
  ExternalLink,
  Settings,
  Palette,
  Bell,
  Shield,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc,
  addDoc,
  deleteDoc
} from 'firebase/firestore'
import { db, auth } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useSiteConfig } from '../../contexts/SiteConfigContext'
import LoadingSpinner from '../../components/LoadingSpinner'

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('mentors')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mentors, setMentors] = useState([])
  const [contactInfo, setContactInfo] = useState({
    email: 'busa.speak@gmail.com',
    telegram: '@busa_speak',
    googleFormUrl: 'https://forms.google.com/your-form-id',
    address: 'Busan, South Korea',
    phone: '+82-10-5889-2707'
  })
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'BUSA Speaking CLUB',
    siteTagline: 'Connect, Speak, Thrive',
    siteDescription: 'Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections.',
    missionStatement: 'Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections.',
    logoUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    maintenanceMode: false,
    registrationEnabled: true,
    maxSessionCapacity: 50,
    defaultSessionDuration: 90,
    emailNotifications: true,
    telegramNotifications: true,
    analyticsEnabled: false,
    googleAnalyticsId: ''
  })

  // Get authentication info and site config
  const { isMentor } = useAuth()
  const { refreshConfig } = useSiteConfig()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      
      // Fetch mentors from Firebase
      const mentorsSnapshot = await getDocs(collection(db, 'mentors'))
      const mentorsData = mentorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      if (mentorsData.length > 0) {
        setMentors(mentorsData)
      } else {
        // Only use demo data if no mentors exist in Firebase
        const demoMentors = [
          {
            name: 'Aziz Karimov',
            role: 'Lead Mentor',
            university: 'Seoul National University',
            major: 'Business Administration',
            bio: 'Passionate about helping Uzbek students develop their speaking skills and confidence.',
            email: 'aziz.karimov@busa.kr',
            linkedin: 'https://linkedin.com/in/azizkarimov',
            telegram: '@aziz_mentor'
          },
          {
            name: 'Malika Uzbekova',
            role: 'Senior Mentor',
            university: 'Yonsei University',
            major: 'International Relations',
            bio: 'Experienced in debate coaching and public speaking training.',
            email: 'malika.uzbekova@busa.kr',
            telegram: '@malika_mentor'
          }
        ]
        
        // Save demo mentors to Firebase
        for (const mentor of demoMentors) {
          await addDoc(collection(db, 'mentors'), mentor)
        }
        
        // Fetch again to get proper IDs
        const newSnapshot = await getDocs(collection(db, 'mentors'))
        const newData = newSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMentors(newData)
      }

      // Fetch site configuration
      const configSnapshot = await getDocs(collection(db, 'siteConfig'))
      if (configSnapshot.docs.length > 0) {
        const configData = configSnapshot.docs[0].data()
        console.log('📊 Loading config from Firebase:', configData)
        
        // Load contact info
        setContactInfo({
          email: configData.email || 'busa.speak@gmail.com',
          telegram: configData.telegram || '@busa_speak',
          googleFormUrl: configData.googleFormUrl || 'https://forms.google.com/your-form-id',
          address: configData.address || 'Busan, South Korea',
          phone: configData.phone || '+82-10-5889-2707'
        })
        
        // Load general settings from Firebase data
        setGeneralSettings(prev => ({
          ...prev,
          siteTitle: configData.siteTitle || prev.siteTitle,
          siteTagline: configData.siteTagline || prev.siteTagline,
          siteDescription: configData.siteDescription || prev.siteDescription,
          missionStatement: configData.missionStatement || prev.missionStatement,
          logoUrl: configData.logoUrl || prev.logoUrl,
          instagramUrl: configData.instagramUrl || prev.instagramUrl,
          youtubeUrl: configData.youtubeUrl || prev.youtubeUrl,
          maintenanceMode: configData.maintenanceMode !== undefined ? configData.maintenanceMode : prev.maintenanceMode,
          registrationEnabled: configData.registrationEnabled !== undefined ? configData.registrationEnabled : prev.registrationEnabled,
          maxSessionCapacity: configData.maxSessionCapacity || prev.maxSessionCapacity,
          defaultSessionDuration: configData.defaultSessionDuration || prev.defaultSessionDuration,
          emailNotifications: configData.emailNotifications !== undefined ? configData.emailNotifications : prev.emailNotifications,
          telegramNotifications: configData.telegramNotifications !== undefined ? configData.telegramNotifications : prev.telegramNotifications,
          analyticsEnabled: configData.analyticsEnabled !== undefined ? configData.analyticsEnabled : prev.analyticsEnabled,
          googleAnalyticsId: configData.googleAnalyticsId || prev.googleAnalyticsId
        }))
        
        console.log('✅ General settings loaded from Firebase')
      } else {
        // Save default config to Firebase including all general settings
        const defaultConfig = {
          // Contact info
          email: 'busa.speak@gmail.com',
          telegram: '@busa_speak',
          googleFormUrl: 'https://forms.google.com/your-form-id',
          address: 'Busan, South Korea',
          phone: '+82-10-5889-2707',
          // General settings
          ...generalSettings
        }
        const docRef = await addDoc(collection(db, 'siteConfig'), defaultConfig)
        console.log('✅ Default configuration saved to Firebase with ID:', docRef.id)
      }
      
    } catch (error) {
      console.error('Error fetching content:', error)
      // Fallback to demo data only if Firebase fails
      setMentors([
        {
          id: '1',
          name: 'Aziz Karimov',
          role: 'Lead Mentor',
          university: 'Seoul National University',
          major: 'Business Administration',
          bio: 'Passionate about helping Uzbek students develop their speaking skills and confidence.',
          email: 'aziz.karimov@busa.kr',
          linkedin: 'https://linkedin.com/in/azizkarimov',
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

  const saveContactInfo = async (newContactInfo) => {
    try {
      setSaving(true)
      
      // Update or create siteConfig in Firebase
      const configSnapshot = await getDocs(collection(db, 'siteConfig'))
      
      if (configSnapshot.docs.length > 0) {
        // Update existing config
        const configRef = doc(db, 'siteConfig', configSnapshot.docs[0].id)
        await updateDoc(configRef, newContactInfo)
      } else {
        // Create new config
        await addDoc(collection(db, 'siteConfig'), newContactInfo)
      }
      
      setContactInfo(newContactInfo)
      
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Error saving contact information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const saveGeneralSettings = async (newSettings) => {
    try {
      setSaving(true)
      console.log('🚀 Saving general settings:', newSettings)
      
      // Merge with contact info and save to siteConfig
      const configData = { ...contactInfo, ...newSettings }
      console.log('📦 Config data to save:', configData)
      
      const configSnapshot = await getDocs(collection(db, 'siteConfig'))
      console.log('📊 Found config documents:', configSnapshot.docs.length)
      
      if (configSnapshot.docs.length > 0) {
        // Update existing config
        const configRef = doc(db, 'siteConfig', configSnapshot.docs[0].id)
        console.log('📝 Updating existing config with ID:', configSnapshot.docs[0].id)
        
        await updateDoc(configRef, configData)
        console.log('✅ Firebase update completed')
      } else {
        // Create new config
        console.log('➕ Creating new config document')
        const docRef = await addDoc(collection(db, 'siteConfig'), configData)
        console.log('✅ New config created with ID:', docRef.id)
      }
      
      // Update local state
      setGeneralSettings(newSettings)
      console.log('🔄 Local state updated:', newSettings)
      
      // Also update contact info state if it was modified
      setContactInfo(prev => ({
        ...prev,
        email: configData.email || prev.email,
        telegram: configData.telegram || prev.telegram,
        googleFormUrl: configData.googleFormUrl || prev.googleFormUrl,
        address: configData.address || prev.address,
        phone: configData.phone || prev.phone
      }))
      
      // Refresh data from Firebase to ensure consistency
      console.log('🔄 Refreshing data from Firebase...')
      await fetchContent()
      
      // Refresh site configuration throughout the app
      console.log('🌐 Refreshing site configuration context...')
      refreshConfig()
      
      alert('General settings saved successfully!')
      console.log('🎉 Save operation completed successfully')
      
    } catch (error) {
      console.error('❌ Error saving general settings:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      let errorMessage = 'Error saving general settings. '
      if (error.code === 'permission-denied') {
        errorMessage += 'You do not have permission to save settings. Please check if you are logged in with a mentor account.'
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'You are not logged in. Please log in with a mentor account.'
      } else {
        errorMessage += error.message
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'mentors', name: 'Mentors', icon: User },
    { id: 'contact', name: 'Contact Info', icon: Mail },
    { id: 'forms', name: 'Forms & Links', icon: LinkIcon },
    { id: 'general', name: 'General Settings', icon: Globe }
  ]

  if (loading) {
    return <LoadingSpinner text="Loading content..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize website content, mentor profiles, and contact information
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/success-stories"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Star className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Success Stories</div>
              <div className="text-sm text-gray-500">Manage testimonials</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </a>
          
          <a
            href="/admin/sessions"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Settings className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Sessions</div>
              <div className="text-sm text-gray-500">Manage speaking sessions</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </a>
          
          <a
            href="/admin/registration"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <User className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Registrations</div>
              <div className="text-sm text-gray-500">View member signups</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'mentors' && (
          <MentorsTab mentors={mentors} setMentors={setMentors} saving={saving} setSaving={setSaving} />
        )}
        
        {activeTab === 'contact' && (
          <ContactTab 
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            saving={saving}
            saveContactInfo={saveContactInfo}
          />
        )}

        {activeTab === 'forms' && (
          <FormsTab 
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            saving={saving}
            saveContactInfo={saveContactInfo}
          />
        )}

        {activeTab === 'general' && (
          <GeneralTab 
            generalSettings={generalSettings}
            setGeneralSettings={setGeneralSettings}
            saving={saving}
            saveGeneralSettings={saveGeneralSettings}
          />
        )}
      </div>
    </div>
  )
}

// Mentors Tab Component
const MentorsTab = ({ mentors, setMentors, saving, setSaving }) => {
  const [editingMentor, setEditingMentor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    university: '',
    major: '',
    bio: '',
    email: '',
    linkedin: '',
    telegram: ''
  })

  const saveMentor = async (mentorData) => {
    try {
      setSaving(true)
      
      // Debug: Check authentication state
      console.log('🔍 Debug - Auth status:', {
        user: auth.currentUser?.email || 'No user',
        uid: auth.currentUser?.uid || 'No UID',
        mentorData: mentorData
      })
      
      if (!auth.currentUser) {
        throw new Error('You must be logged in to save mentors')
      }
      
      if (editingMentor?.id) {
        // Update existing mentor in Firebase
        console.log('📝 Updating mentor with ID:', editingMentor.id)
        const mentorRef = doc(db, 'mentors', editingMentor.id)
        await updateDoc(mentorRef, mentorData)
        
        // Update local state
        setMentors(mentors.map(m => 
          m.id === editingMentor.id ? { ...m, ...mentorData } : m
        ))
        console.log('✅ Mentor updated successfully')
      } else {
        // Add new mentor to Firebase
        console.log('➕ Creating new mentor')
        const docRef = await addDoc(collection(db, 'mentors'), mentorData)
        console.log('✅ New mentor created with ID:', docRef.id)
        
        // Add to local state with Firebase-generated ID
        const newMentor = { id: docRef.id, ...mentorData }
        setMentors([...mentors, newMentor])
      }
      
      setEditingMentor(null)
      setFormData({
        name: '', role: '', university: '', major: '', bio: '', email: '', linkedin: '', telegram: ''
      })
      
      console.log('🎉 Mentor saved successfully!')
      
    } catch (error) {
      console.error('❌ Error saving mentor:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // More specific error messages
      let errorMessage = 'Error saving mentor. '
      if (error.code === 'permission-denied') {
        errorMessage += 'You do not have permission to save mentors. Please check if you are logged in with a mentor account.'
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'You are not logged in. Please log in with a mentor account.'
      } else {
        errorMessage += error.message
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const deleteMentor = async (mentorId) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return
    
    try {
      // Delete from Firebase
      await deleteDoc(doc(db, 'mentors', mentorId))
      
      // Remove from local state
      setMentors(mentors.filter(m => m.id !== mentorId))
    } catch (error) {
      console.error('Error deleting mentor:', error)
      alert('Error deleting mentor. Please try again.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMentor(formData)
  }

  const startEdit = (mentor) => {
    setEditingMentor(mentor)
    setFormData(mentor)
  }

  const cancelEdit = () => {
    setEditingMentor(null)
    setFormData({
      name: '', role: '', university: '', major: '', bio: '', email: '', linkedin: '', telegram: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Manage Mentors</h3>
        <button
          onClick={() => setEditingMentor({})}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Mentor
        </button>
      </div>

      {/* Mentors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{mentor.name}</h4>
                <p className="text-sm text-gray-500">{mentor.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{mentor.university}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{mentor.bio}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => startEdit(mentor)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMentor(mentor.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingMentor && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingMentor.id ? 'Edit Mentor' : 'Add New Mentor'}
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Major</label>
              <input
                type="text"
                required
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telegram</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                placeholder="@username"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Mentor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// Contact Tab Component
const ContactTab = ({ contactInfo, setContactInfo, saving, saveContactInfo }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telegram</label>
          <input
            type="text"
            value={contactInfo.telegram}
            onChange={(e) => setContactInfo({...contactInfo, telegram: e.target.value})}
            placeholder="@busa_speak"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveContactInfo(contactInfo)}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>
    </div>
  )
}

// Forms Tab Component
const FormsTab = ({ contactInfo, setContactInfo, saving, saveContactInfo }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Forms & Links</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Google Form URL</label>
        <p className="text-sm text-gray-500 mt-1">
          Enter the Google Form link for member registration
        </p>
        <div className="mt-2 relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="url"
            value={contactInfo.googleFormUrl}
            onChange={(e) => setContactInfo({...contactInfo, googleFormUrl: e.target.value})}
            placeholder="https://forms.google.com/your-form-id"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How to get your Google Form URL:</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Open your Google Form</li>
          <li>Click "Send" in the top right</li>
          <li>Click the link icon</li>
          <li>Copy the URL and paste it above</li>
        </ol>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveContactInfo(contactInfo)}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Form Links'}
        </button>
      </div>
    </div>
  )
}

// General Tab Component
const GeneralTab = ({ generalSettings, setGeneralSettings, saving, saveGeneralSettings }) => {
  const handleSave = () => {
    saveGeneralSettings(generalSettings)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Site Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-primary-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">Site Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Title</label>
            <input
              type="text"
              value={generalSettings.siteTitle}
              onChange={(e) => setGeneralSettings({...generalSettings, siteTitle: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="BUSA Speaking CLUB"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Tagline</label>
            <input
              type="text"
              value={generalSettings.siteTagline}
              onChange={(e) => setGeneralSettings({...generalSettings, siteTagline: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Connect, Speak, Thrive"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
            <input
              type="url"
              value={generalSettings.logoUrl}
              onChange={(e) => setGeneralSettings({...generalSettings, logoUrl: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              rows={2}
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections."
            />
            <p className="text-sm text-gray-500 mt-1">This appears in search results and social media shares</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mission Statement</label>
            <textarea
              rows={3}
              value={generalSettings.missionStatement}
              onChange={(e) => setGeneralSettings({...generalSettings, missionStatement: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections."
            />
            <p className="text-sm text-gray-500 mt-1">This appears in the footer and about sections</p>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Palette className="w-5 h-5 text-primary-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">Social Media Links</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              value={generalSettings.instagramUrl}
              onChange={(e) => setGeneralSettings({...generalSettings, instagramUrl: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://instagram.com/busa_speaking"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube Channel</label>
            <input
              type="url"
              value={generalSettings.youtubeUrl}
              onChange={(e) => setGeneralSettings({...generalSettings, youtubeUrl: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://youtube.com/@busaspeakingclub"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Note: Telegram link is managed in the Contact Info tab. Only Instagram and YouTube are displayed in the footer social section.
          </p>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-primary-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">System Settings</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Registration Settings</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={generalSettings.registrationEnabled}
                  onChange={(e) => setGeneralSettings({...generalSettings, registrationEnabled: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable new registrations</span>
              </label>
              
              <div>
                <label className="block text-xs font-medium text-gray-600">Default Session Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={generalSettings.maxSessionCapacity}
                  onChange={(e) => setGeneralSettings({...generalSettings, maxSessionCapacity: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600">Default Session Duration (minutes)</label>
                <input
                  type="number"
                  min="30"
                  max="240"
                  step="15"
                  value={generalSettings.defaultSessionDuration}
                  onChange={(e) => setGeneralSettings({...generalSettings, defaultSessionDuration: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Site Status</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Maintenance mode</span>
              </label>
              
              {generalSettings.maintenanceMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Maintenance mode will show a "Site Under Maintenance" message to all non-admin users.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-primary-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">Notification Settings</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generalSettings.emailNotifications}
                onChange={(e) => setGeneralSettings({...generalSettings, emailNotifications: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email notifications for new registrations</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generalSettings.telegramNotifications}
                onChange={(e) => setGeneralSettings({...generalSettings, telegramNotifications: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Telegram notifications for new registrations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Analytics Settings */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-primary-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">Analytics & Tracking</h4>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={generalSettings.analyticsEnabled}
              onChange={(e) => setGeneralSettings({...generalSettings, analyticsEnabled: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Google Analytics</span>
          </label>
          
          {generalSettings.analyticsEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
              <input
                type="text"
                value={generalSettings.googleAnalyticsId}
                onChange={(e) => setGeneralSettings({...generalSettings, googleAnalyticsId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-sm text-gray-500 mt-1">Enter your Google Analytics 4 measurement ID</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}

export default ContentManager 