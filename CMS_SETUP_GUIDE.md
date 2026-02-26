# BUSA Speaking Club - Dynamic CMS Setup Guide

## 🎯 Overview

This guide explains how to set up and use the complete dynamic content management system for the BUSA Speaking Club website. Mentors can now manage all website content through the admin dashboard without touching code.

## 🏗️ System Architecture

### Frontend
- **React + Vite** - Modern web framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Modern icon library

### Backend
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - File/image storage
- **Firebase Auth** - Authentication system

### Security
- **Role-based access control** - Only mentors can edit content
- **Firestore Security Rules** - Database-level security
- **Public read access** - Anyone can view content

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Git installed

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uzkorea-speak-club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase configuration**
   - Copy `.env.example` to `.env`
   - Add your Firebase config values

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "BUSA Speaking Club"
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider
4. Add authorized domains (your deployment domain)

### 3. Create Firestore Database
1. Go to Firestore Database
2. Create database in **production mode**
3. Choose your region (asia-northeast1 for Korea)

### 4. Enable Storage
1. Go to Storage
2. Get started with default security rules
3. We'll update rules later

### 5. Deploy Security Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage
```

### 6. Environment Variables
Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 👥 User Management

### Mentor Access
Only these email addresses can access admin features:
- `aziz.karimov@busa.kr`
- `malika.uzbekova@busa.kr`
- `bekzod.tashkentov@busa.kr`
- `admin@busa.kr`
- `alexnabiyev5@gmail.com`

### Adding New Mentors
1. Update `src/contexts/AuthContext.jsx` - add email to mentor list
2. Update `firestore.rules` - add email to security rules
3. Redeploy the application

## 📊 Database Collections

### Sessions Collection (`sessions`)
```javascript
{
  title: "English Conversation Practice",
  description: "Interactive session for practicing English",
  date: Timestamp,
  type: "zoom" | "offline",
  location: "Zoom Meeting Room",
  zoomLink: "https://zoom.us/j/...",
  maxAttendees: 50,
  currentAttendees: 25,
  status: "upcoming" | "completed",
  createdAt: Timestamp
}
```

### Events Collection (`events`)
```javascript
{
  title: "Annual Speaking Competition",
  description: "Our biggest event of the year",
  date: Timestamp,
  type: "competition" | "workshop" | "networking" | "social",
  location: "Seoul National University",
  maxAttendees: 200,
  currentAttendees: 150,
  registrationRequired: true,
  registrationLink: "https://forms.google.com/...",
  photoUrl: "https://storage.googleapis.com/...",
  status: "upcoming" | "completed",
  createdAt: Timestamp
}
```

### Success Stories Collection (`successStories`)
```javascript
{
  studentName: "Aziza Sultanova",
  university: "Seoul National University", 
  major: "International Business",
  story: "BUSA helped me gain confidence...",
  rating: 5,
  photoUrl: "https://storage.googleapis.com/...",
  achievement: "Became Student Council Representative",
  beforeAfter: "Before: Nervous. After: Confident.",
  featured: true,
  createdAt: Timestamp
}
```

### Mentors Collection (`mentors`)
```javascript
{
  name: "Aziz Karimov",
  role: "Lead Mentor",
  university: "Seoul National University",
  major: "Business Administration",
  bio: "Passionate about helping students...",
  email: "aziz.karimov@busa.kr",
  telegram: "@aziz_mentor",
  linkedin: "https://linkedin.com/in/...",
  photo: "https://storage.googleapis.com/..."
}
```

### Site Config Collection (`siteConfig`)
```javascript
{
  email: "busa.speak@gmail.com",
  phone: "+82-10-1234-5678",
  telegram: "@busa_speak",
  address: "Seoul, South Korea",
  googleFormUrl: "https://forms.google.com/..."
}
```

## 🛠️ Admin Dashboard Features

### 1. Dashboard (`/admin`)
- **Analytics Overview**: Total sessions, attendees, ratings
- **Recent Activity**: Latest sessions and events
- **Quick Actions**: Create session, upload photos
- **Statistics Cards**: Key metrics display

### 2. Session Manager (`/admin/sessions`)
- **CRUD Operations**: Create, read, update, delete sessions
- **Search & Filter**: Find sessions by title, type
- **Form Validation**: Required fields, date validation
- **Zoom Integration**: Manage Zoom links for online sessions

### 3. Event Manager (`/admin/events`)
- **Full Event Management**: Create workshops, competitions, networking events
- **Photo Upload**: Firebase Storage integration
- **Registration Tracking**: Monitor attendee numbers
- **Event Types**: Workshop, competition, networking, social

### 4. Success Stories Manager (`/admin/success-stories`)
- **Student Testimonials**: Manage success stories and testimonials
- **Rating System**: 5-star rating display
- **Photo Management**: Student profile photos
- **Featured Stories**: Highlight special achievements
- **Achievement Tracking**: Before/after progress notes

### 5. Content Manager (`/admin/content`)
- **Mentor Profiles**: Add/edit mentor information
- **Contact Information**: Update email, phone, Telegram
- **Google Forms**: Update registration form links
- **Site Settings**: General website configuration

### 6. Photo Upload (`/admin/photos`)
- **Gallery Management**: Upload and organize event photos
- **Firebase Storage**: Secure cloud storage
- **Drag & Drop**: Easy file upload interface

## 🔐 Security Features

### Authentication
- **Firebase Auth**: Secure login system
- **Role-based Access**: Only mentors can access admin
- **Session Management**: Automatic login/logout

### Database Security
- **Public Read Access**: Anyone can view content
- **Mentor Write Access**: Only mentors can edit
- **Email Verification**: Mentor emails are hardcoded
- **Field Validation**: Required fields, data types

### File Upload Security
- **Authenticated Uploads**: Only mentors can upload
- **File Type Restrictions**: Images only
- **Storage Rules**: Firebase Storage security
- **CDN Delivery**: Fast, secure file serving

## 🌐 Public Pages Integration

### Dynamic Content Loading
All public pages now fetch live data from Firebase:

1. **Home Page** (`/`)
   - Dynamic success stories section
   - Real-time statistics
   - Featured content

2. **Events Page** (`/events`)
   - Live upcoming events
   - Session schedules
   - Registration links

3. **Sessions Page** (`/sessions`)
   - Interactive calendar
   - Session details modal
   - Real-time attendance

4. **About Page** (`/about`)
   - Dynamic mentor profiles
   - Live statistics

5. **Contact Page** (`/contact`)
   - Dynamic contact information
   - Live Google Form links

6. **Mentors Page** (`/mentors`)
   - Dynamic mentor grid
   - Social media links

## 📱 Responsive Design

### Mobile-First Approach
- **Tailwind CSS**: Responsive utility classes
- **Mobile Navigation**: Collapsible sidebar
- **Touch-Friendly**: Large buttons, easy scrolling
- **Progressive Enhancement**: Works on all devices

### Performance Optimization
- **Lazy Loading**: Images load on demand
- **Code Splitting**: Route-based chunks
- **Firebase CDN**: Fast content delivery
- **Caching**: Browser and Firebase caching

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Complete CMS implementation"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import GitHub repository
   - Add environment variables
   - Deploy

3. **Environment Variables in Vercel**
   - Add all Firebase config variables
   - Enable automatic deployments

### Firebase Hosting (Alternative)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🔄 Content Workflow

### For Mentors
1. **Login**: Visit `/login` and sign in with mentor email
2. **Access Admin**: Navigate to `/admin` after login
3. **Manage Content**: Use sidebar navigation to access different managers
4. **Create Content**: Use "New" buttons to create sessions, events, stories
5. **Upload Media**: Use photo upload for events and stories
6. **Update Info**: Use content manager for site information

### For Public Users
1. **Browse Content**: All pages show live, updated content
2. **Register**: Click registration links to join events/sessions
3. **View Schedule**: Interactive calendar shows all upcoming activities
4. **Read Stories**: See success stories from real members

## 🛠️ Development

### Adding New Features
1. **Create Component**: Add to `/src/pages/admin/`
2. **Add Route**: Update `/src/App.jsx`
3. **Update Navigation**: Modify `/src/components/admin/AdminLayout.jsx`
4. **Database Schema**: Add Firestore collection
5. **Security Rules**: Update `firestore.rules`

### Database Management
```javascript
// Adding new collection
const newCollection = collection(db, 'newCollection')
await addDoc(newCollection, data)

// Querying data
const q = query(
  collection(db, 'events'),
  where('date', '>=', new Date()),
  orderBy('date', 'asc')
)
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Check `.env` file has all required variables
   - Verify Firebase project settings

2. **Authentication Failed**
   - Ensure email is in mentor list
   - Check Firebase Auth is enabled

3. **Permission Denied**
   - Verify Firestore rules are deployed
   - Check user email in security rules

4. **Images Not Loading**
   - Verify Firebase Storage is enabled
   - Check storage security rules

### Debug Commands
```bash
# Check Firebase connection
firebase projects:list

# Test security rules locally
firebase emulators:start --only firestore

# View logs
firebase functions:log
```

## 📞 Support

### For Technical Issues
- Check browser console for errors
- Verify Firebase configuration
- Review security rules

### For Content Management
- Use admin dashboard help tooltips
- Follow form validation messages
- Contact development team

## 🔮 Future Enhancements

### Planned Features
- **Email Notifications**: Auto-notify on new events
- **Advanced Analytics**: Detailed usage statistics
- **Bulk Operations**: Mass import/export
- **Comments System**: Student feedback on events
- **Calendar Integration**: Google Calendar sync
- **Multi-language Support**: Korean translation

### Scalability
- **CDN Integration**: Cloudflare for global delivery
- **Database Optimization**: Indexed queries
- **Image Optimization**: WebP format, compression
- **Caching Strategy**: Redis for frequently accessed data

---

## 📋 Checklist for Production

### Pre-Deployment
- [ ] Firebase project configured
- [ ] Environment variables set
- [ ] Security rules deployed
- [ ] Mentor emails added
- [ ] Authentication tested
- [ ] Content management tested
- [ ] Public pages tested
- [ ] Mobile responsiveness verified

### Post-Deployment
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up
- [ ] Team training completed

---

**🎉 Congratulations! Your BUSA Speaking Club website now has a complete dynamic content management system. Mentors can manage all content without developer support, and the public site automatically updates with fresh content.** 