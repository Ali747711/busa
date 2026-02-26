# 🔐 BUSA Speaking Club Admin Dashboard Setup

## Overview
A secure, role-based admin dashboard for BUSA Speaking Club mentors to manage sessions, upload photos, coordinate travel, and oversee club operations.

## 🚀 Features

### ✅ Implemented
- **Authentication**: Firebase Auth with email/password and Google Sign-In
- **Role-Based Access**: Only mentors can access admin routes
- **Session Manager**: Full CRUD operations for speaking sessions
- **Photo Upload**: Firebase Storage integration for session photos
- **Dashboard**: Statistics and activity overview
- **Responsive Design**: Mobile-first with collapsible sidebar

### 🚧 Coming Soon
- Calendar View with visual session management
- Travel Coordination for offline events
- Registration Form Editor
- Advanced Analytics & Reporting

## 📋 Setup Instructions

### 1. **Firebase Configuration**

Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

#### Enable Services:
- **Authentication**: Email/Password + Google providers
- **Firestore Database**: Create in production mode
- **Storage**: Create default bucket

#### Environment Variables:
Create `.env.local` in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. **Mentor Access Setup**

#### Add Mentor Emails:
Edit `src/contexts/AuthContext.jsx` line 29:

```javascript
const mentorEmails = [
  'aziz.karimov@busa.kr',
  'malika.uzbekova@busa.kr', 
  'bekzod.tashkentov@busa.kr',
  'admin@busa.kr',
  'your-mentor@email.com'  // Add new mentors here
]
```

#### Create Mentor Accounts:
1. Go to `/login` page
2. Sign up with mentor email
3. Account automatically gets 'mentor' role
4. Access admin at `/admin`

### 3. **Firestore Collections**

The app creates these collections automatically:

```
📁 sessions
  - title: string
  - description: string
  - date: timestamp
  - type: 'zoom' | 'offline'
  - location: string
  - zoomLink: string (optional)
  - maxAttendees: number
  - currentAttendees: number
  - status: 'upcoming' | 'completed'

📁 photos
  - fileName: string
  - url: string (download URL)
  - sessionTitle: string
  - uploadedAt: timestamp
  - size: number
  - storagePath: string

📁 users
  - email: string
  - displayName: string
  - role: 'mentor' | 'member'
  - createdAt: timestamp
  - lastLogin: timestamp
```

### 4. **Storage Rules**

Update Firebase Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /session-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && resource == null
        && request.resource.size < 10 * 1024 * 1024;
      allow delete: if request.auth != null;
    }
  }
}
```

### 5. **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read sessions and photos
    match /sessions/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'mentor';
    }
    
    match /photos/{photoId} {
      allow read: if true;
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'mentor';
    }
  }
}
```

## 🎯 Admin Dashboard Features

### 📊 Dashboard
- Session statistics (total, attendees, ratings)
- Recent activity timeline
- Quick action buttons
- Performance metrics

### 🗓 Session Manager
- **Add Sessions**: Create Zoom or offline sessions
- **Edit Sessions**: Update details, location, capacity
- **Delete Sessions**: Remove cancelled sessions
- **Search & Filter**: Find sessions by type or keyword
- **Attendee Tracking**: Monitor RSVP counts

### 🖼 Photo Upload
- **Drag & Drop**: Easy file upload interface
- **Firebase Storage**: Secure cloud storage
- **Batch Upload**: Multiple files at once
- **Gallery View**: Preview all uploaded photos
- **Session Tagging**: Associate photos with sessions

### 🔐 Security Features
- **Role-Based Access**: Only mentors can access admin
- **Protected Routes**: Automatic redirection for unauthorized users
- **Session Management**: Secure authentication state
- **Error Handling**: Graceful fallbacks for offline use

## 🚀 Usage Guide

### For Mentors:

1. **Login**: Go to `/login` and sign in with mentor credentials
2. **Dashboard**: Overview of club statistics and recent activity
3. **Create Session**: 
   - Click "New Session" in dashboard or session manager
   - Fill in title, description, date/time
   - Choose Zoom or offline type
   - Set location/Zoom link and capacity
4. **Upload Photos**:
   - Go to Photo Upload section
   - Drag files or click to select
   - Add session title for context
   - Upload to Firebase Storage
5. **Manage Sessions**:
   - View all sessions in table format
   - Edit details by clicking edit icon
   - Delete sessions with confirmation

### Demo Credentials:
- **Email**: admin@busa.kr
- **Password**: admin123

## 🛠 Development

### Running Locally:
```bash
npm install
npm run dev
```

### Building for Production:
```bash
npm run build
npm run preview
```

### Firebase Deployment:
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 📱 Mobile Responsive

- **Collapsible Sidebar**: Touch-friendly navigation
- **Responsive Tables**: Horizontal scroll on mobile
- **Touch Optimized**: Large tap targets
- **Adaptive Layout**: Stacked forms on small screens

## 🔧 Customization

### Adding New Admin Pages:
1. Create component in `src/pages/admin/`
2. Add route in `src/App.jsx` admin section
3. Update navigation in `src/components/admin/AdminLayout.jsx`

### Modifying Mentor List:
Update `mentorEmails` array in `src/contexts/AuthContext.jsx`

### Styling:
- Colors defined in `tailwind.config.js`
- Primary: #ef4444 (BUSA red)
- Components use Tailwind classes
- Icons from Lucide React

## 🚨 Security Notes

- Never commit `.env.local` to version control
- Use Firebase Security Rules for production
- Regularly review mentor access list
- Monitor Firebase usage and costs
- Enable Firebase Security monitoring

## 📞 Support

For technical issues or feature requests:
- Email: admin@busa.kr
- GitHub Issues: Create detailed bug reports
- Documentation: Check Firebase docs for advanced features

---

**Built with ❤️ for BUSA Speaking Club mentors** 