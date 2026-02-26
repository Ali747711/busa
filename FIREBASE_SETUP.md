# 🔥 Firebase Setup Guide

## Quick Fix for Current Issues

Your website is showing Firebase errors because the environment variables aren't configured. Follow these steps to fix it:

### Step 1: Create Firebase Project (if you haven't already)

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"** or select existing project
3. **Project name**: "BUSA Speaking Club" (or any name you prefer)
4. **Enable Google Analytics** (optional)
5. **Create project**

### Step 2: Enable Required Services

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password** provider
   - Enable **Google** provider
   - Click "Save"

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose **"Start in production mode"**
   - Select region (choose closest to Korea: `asia-northeast1`)

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Use default security rules for now

### Step 3: Get Your Configuration

1. **In Firebase Console** → Project Settings (gear icon)
2. **Scroll down** to "Your apps" section
3. **If no web app exists**: Click "Add app" → Web (</>) → Register app
4. **Copy the config object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** in the project root:
   ```bash
   # Create the file
   touch .env.local
   ```

2. **Edit `.env.local`** with your actual values:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### Step 5: Deploy Security Rules

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not done):
   ```bash
   firebase init
   ```
   - Select **Firestore** and **Storage**
   - Use existing project
   - Accept default files

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

### Step 6: Restart Development Server

```bash
npm run dev
```

Your console should now show:
```
🔥 Firebase Config Status: { configured: true, project: 'your-project-id', missing: [] }
```

## ✅ Testing Your Setup

1. **Visit**: `http://localhost:5174/setup`
2. **Create mentor accounts** with the setup tool
3. **Test login** at `/login` with a mentor email
4. **Access admin** at `/admin` dashboard
5. **Try creating a session** to test Firestore
6. **Upload a photo** to test Storage

## 🚨 Troubleshooting

### "Missing or insufficient permissions"
- **Solution**: Deploy Firestore security rules with `firebase deploy --only firestore:rules`

### "Network error" on Firebase Storage
- **Solution**: Check Storage is enabled and deploy storage rules

### "Configuration object is invalid"
- **Solution**: Verify all environment variables in `.env.local` are correct

### Service Worker Conflicts
- **Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

## 🔐 Security Notes

- **Never commit** `.env.local` to Git (it's in .gitignore)
- **For production**: Set environment variables in your hosting platform
- **Firestore rules**: Allow public read, mentor-only write access
- **Storage rules**: Public read for images, mentor-only upload

## 🎯 Next Steps After Setup

1. **Create some demo content** through admin dashboard
2. **Test all admin features** (sessions, events, success stories)
3. **Verify public pages** show dynamic data
4. **Share mentor credentials** with your team
5. **Deploy to production** when ready

---

**Need help?** Check the console for specific error messages and configuration status. 