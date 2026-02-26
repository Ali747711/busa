import { createContext, useContext, useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

const SiteConfigContext = createContext()

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider')
  }
  return context
}

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    // Default values (fallbacks)
    siteTitle: 'BUSA Speaking CLUB',
    siteTagline: 'Connect, Speak, Thrive',
    siteDescription: 'Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections.',
    missionStatement: 'Empowering Uzbek students in Korea to develop confident English communication skills through structured practice, meaningful debates, and supportive community connections.',
    logoUrl: '',
    email: 'busa.speak@gmail.com',
    telegram: '@busa_speak',
    phone: '+82-10-5889-2707',
    address: 'Busan, South Korea',
    googleFormUrl: 'https://forms.google.com/your-form-id',
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
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSiteConfig = async () => {
    try {
      setLoading(true)
      console.log('🌐 SiteConfig: Fetching configuration from Firebase...')
      
      const configSnapshot = await getDocs(collection(db, 'siteConfig'))
      
      if (configSnapshot.docs.length > 0) {
        const configData = configSnapshot.docs[0].data()
        console.log('✅ SiteConfig: Configuration loaded from Firebase:', configData)
        
        // Merge with defaults to ensure all properties exist
        setConfig(prev => ({
          ...prev,
          ...configData
        }))
      } else {
        console.log('⚠️ SiteConfig: No configuration found in Firebase, using defaults')
      }
      
      setError(null)
    } catch (error) {
      console.error('❌ SiteConfig: Error fetching configuration:', error)
      setError(error.message)
      // Keep using default config on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSiteConfig()
  }, [])

  // Refresh function for manual updates
  const refreshConfig = () => {
    fetchSiteConfig()
  }

  const value = {
    config,
    loading,
    error,
    refreshConfig,
    
    // Convenience getters for commonly used values
    get siteTitle() { return config.siteTitle },
    get siteDescription() { return config.siteDescription },
    get isMaintenanceMode() { return config.maintenanceMode },
    get isRegistrationEnabled() { return config.registrationEnabled },
    get contactInfo() {
      return {
        email: config.email,
        telegram: config.telegram,
        phone: config.phone,
        address: config.address
      }
    },
    get socialLinks() {
      return {
        instagram: config.instagramUrl,
        youtube: config.youtubeUrl
      }
    }
  }

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  )
} 