import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../config/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Predefined mentor emails (LEGACY - now only used as fallback)
  // The primary source of mentor roles is now Firestore user documents
  // This list is only used when no Firestore document exists
  const mentorEmails = [
    'aziz.karimov@busa.kr',
    'malika.uzbekova@busa.kr', 
    'bekzod.tashkentov@busa.kr',
    'admin@busa.kr',
    'alexnabiyev5@gmail.com'
    // Note: New mentors created through /setup will get proper Firestore roles
  ]

  // Get user role from Firestore or determine from email
  const getUserRole = async (user) => {
    try {
      // First check Firestore for role (this is now the primary source of truth)
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        // If user has a role in Firestore, use it
        if (userData.role) {
          return userData.role
        }
      }
      
      // If no Firestore document exists or no role specified, check hardcoded mentor list
      const isMentor = mentorEmails.includes(user.email.toLowerCase())
      const role = isMentor ? 'mentor' : 'member'
      
      // Create user document in Firestore for future reference
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || '',
        role: role,
        createdAt: new Date(),
        lastLogin: new Date(),
        createdBy: 'auto-assignment'  // Track automatic role assignment
      })
      
      return role
    } catch (error) {
      console.error('Error getting user role:', error)
      // Fallback to email check
      return mentorEmails.includes(user.email.toLowerCase()) ? 'mentor' : 'member'
    }
  }

  // Update last login time
  const updateLastLogin = async (userId) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        lastLogin: new Date()
      }, { merge: true })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user)
          const role = await getUserRole(user)
          setUserRole(role)
          await updateLastLogin(user.uid)
        } else {
          setUser(null)
          setUserRole(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUpWithEmail = async (email, password, displayName = '') => {
    try {
      setError(null)
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document
      await setDoc(doc(db, 'users', result.user.uid), {
        email: email,
        displayName: displayName,
        role: mentorEmails.includes(email.toLowerCase()) ? 'mentor' : 'member',
        createdAt: new Date(),
        lastLogin: new Date()
      })
      
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
      setUserRole(null)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Check if user is mentor
  const isMentor = userRole === 'mentor'

  // Check if user is admin (specific mentor with admin privileges)
  const isAdmin = isMentor && user?.email === 'admin@busa.kr'

  const value = {
    user,
    userRole,
    loading,
    error,
    isMentor,
    isAdmin,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 