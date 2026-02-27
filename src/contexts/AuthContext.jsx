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

// The root manager email from env — always gets admin role, is the only one who can access /setup.
const ROOT_MANAGER_EMAIL = import.meta.env.VITE_ROOT_MANAGER_EMAIL

// Legacy fallback list — only used when a user has no Firestore document yet.
// New mentors should be assigned via UserManager (sets role in Firestore).
const LEGACY_MENTOR_EMAILS = [
  'aziz.karimov@busa.kr',
  'malika.uzbekova@busa.kr',
  'bekzod.tashkentov@busa.kr',
  'admin@busa.kr',
  'alexnabiyev5@gmail.com',
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get user role from Firestore; fall back to legacy email list for first-time users
  const getUserRole = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.role) return data.role
      }

      // Root manager always gets admin — bootstraps the project without pre-existing Firestore data
      if (ROOT_MANAGER_EMAIL &&
          firebaseUser.email.toLowerCase() === ROOT_MANAGER_EMAIL.toLowerCase()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date(),
          createdBy: 'root-manager',
        })
        return 'admin'
      }

      // No Firestore document yet — bootstrap from legacy list
      const role = LEGACY_MENTOR_EMAILS.includes(firebaseUser.email.toLowerCase())
        ? 'mentor'
        : 'member'

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        role,
        createdAt: new Date(),
        lastLogin: new Date(),
        createdBy: 'auto-assignment',
      })

      return role
    } catch (err) {
      console.error('Error getting user role:', err)
      // Last-resort fallback — avoids blocking login on Firestore errors
      if (ROOT_MANAGER_EMAIL &&
          firebaseUser.email.toLowerCase() === ROOT_MANAGER_EMAIL.toLowerCase()) {
        return 'admin'
      }
      return LEGACY_MENTOR_EMAILS.includes(firebaseUser.email.toLowerCase())
        ? 'mentor'
        : 'member'
    }
  }

  const updateLastLogin = async (userId) => {
    try {
      await setDoc(doc(db, 'users', userId), { lastLogin: new Date() }, { merge: true })
    } catch (err) {
      console.error('Error updating last login:', err)
    }
  }

  // onAuthStateChanged owns the loading state — sign-in helpers must not touch it
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser)
          const role = await getUserRole(firebaseUser)
          setUserRole(role)
          await updateLastLogin(firebaseUser.uid)
        } else {
          setUser(null)
          setUserRole(null)
        }
      } catch (err) {
        console.error('Auth state change error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signInWithEmail = async (email, password) => {
    try {
      setError(null)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      return await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signUpWithEmail = async (email, password, displayName = '') => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        role: LEGACY_MENTOR_EMAILS.includes(email.toLowerCase()) ? 'mentor' : 'member',
        createdAt: new Date(),
        lastLogin: new Date(),
      })

      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
      setUserRole(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Admin is a superset of mentor — both can access admin features
  const isMentor = userRole === 'mentor' || userRole === 'admin'
  // Admin role is stored in Firestore, not tied to a hardcoded email
  const isAdmin = userRole === 'admin'

  // Root manager check — email-based, for protecting /setup
  const isRootManager = !!(
    ROOT_MANAGER_EMAIL &&
    user?.email?.toLowerCase() === ROOT_MANAGER_EMAIL.toLowerCase()
  )

  const value = {
    user,
    userRole,
    loading,
    error,
    isMentor,
    isAdmin,
    isRootManager,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
