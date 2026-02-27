# BUSA Speaking Club Web Application

A comprehensive web platform designed to empower Uzbek students in Korea through English communication and community building. This application provides a complete solution for managing speaking club activities, member registrations, and event coordination.
mentor1@busa.kr

## 🌟 Features

### For Members

- **Event Registration**: Easy sign-up for speaking sessions and debates
- **Session Calendar**: View upcoming events and past activities
- **Success Stories**: Read testimonials from fellow members
- **Contact Forms**: Reach out to mentors and administrators
- **Mobile Responsive**: Works perfectly on all devices

### For Mentors/Administrators

- **Admin Dashboard**: Complete control panel for managing all aspects
- **Event Management**: Create, edit, and manage speaking sessions
- **Member Management**: Track registrations and member information
- **Content Management**: Update website content in real-time
- **Photo Gallery**: Upload and manage event photos
- **Registration Management**: Handle member applications and approvals

## 🛠️ Tech Stack

- **Frontend**: React.js 19 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Calendar**: React Calendar

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd uzkorea-speak-club
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── HeroSection.jsx  # Landing page hero
│   ├── Navbar.jsx       # Navigation component
│   ├── Footer.jsx       # Site footer
│   └── admin/           # Admin-specific components
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── About.jsx        # About page
│   ├── Contact.jsx      # Contact page
│   └── admin/           # Admin pages
├── contexts/            # React contexts
│   ├── AuthContext.jsx  # Authentication context
│   └── SiteConfigContext.jsx # Site configuration
├── config/              # Configuration files
│   └── firebase.js      # Firebase configuration
└── assets/              # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Setup

1. Create a Firebase project
2. Enable Firestore, Authentication, and Storage
3. Set up security rules
4. Configure authentication providers

## 🔐 Security

- Environment variables are properly configured
- Firebase security rules are implemented
- Authentication is required for admin access
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Team

- **BUSA Speaking Club** - Project stakeholders
- **Development Team** - Technical implementation

## 📞 Support

For support or questions, please contact the BUSA team or create an issue in the repository.

---

**Built with ❤️ for the Uzbek student community in Korea**
