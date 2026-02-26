import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

// Utility to create mentor accounts with custom data
export const createMentorAccounts = async (mentorData) => {
  const results = []
  
  for (const mentor of mentorData) {
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        mentor.email, 
        mentor.password
      )
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: mentor.name
      })
      
      // Create Firestore user document with mentor role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: mentor.email,
        displayName: mentor.name,
        role: 'mentor',  // Always assign mentor role for accounts created through setup
        createdAt: new Date(),
        lastLogin: new Date(),
        createdBy: 'setup', // Track that this was created through setup process
        isActive: true
      })
      
      results.push({
        type: 'success',
        email: mentor.email,
        message: `✅ Successfully created mentor account for ${mentor.email} with admin permissions`
      })
      
    } catch (error) {
      let message = `❌ Error creating account for ${mentor.email}: `
      
      if (error.code === 'auth/email-already-in-use') {
        message = `⚠️ Account already exists for ${mentor.email}`
      } else if (error.code === 'auth/weak-password') {
        message = `❌ Password too weak for ${mentor.email}`
      } else if (error.code === 'auth/invalid-email') {
        message = `❌ Invalid email format: ${mentor.email}`
      } else {
        message += error.message
      }
      
      results.push({
        type: 'error',
        email: mentor.email,
        message
      })
    }
  }
  
  return results
}

// Instructions for use:
// 1. Update the passwords above to secure ones
// 2. Import this function in a component
// 3. Call createMentorAccounts() once to create accounts
// 4. Delete this file after accounts are created 