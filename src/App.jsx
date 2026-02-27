import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SiteConfigProvider } from './contexts/SiteConfigContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Sessions from './pages/Sessions'
import Mentors from './pages/Mentors'
import Contact from './pages/Contact'

// Auth pages
import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'

// Setup page (temporary)
import Setup from './pages/Setup'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import SessionManager from './pages/admin/SessionManager'
import EventManager from './pages/admin/EventManager'
import RegistrationManager from './pages/admin/RegistrationManager'
import PhotoUpload from './pages/admin/PhotoUpload'
import ContentManager from './pages/admin/ContentManager'
import SuccessStoriesManager from './pages/admin/SuccessStoriesManager'
import UserManager from './pages/admin/UserManager'

function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth routes (no navbar/footer) */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Setup route — root manager only */}
              <Route path="/setup" element={
                <ProtectedRoute requireRootManager={true}>
                  <Setup />
                </ProtectedRoute>
              } />

              {/* Admin routes (protected, with admin layout) */}
              <Route path="/admin" element={
                <ProtectedRoute requireMentor={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="sessions" element={<SessionManager />} />
                <Route path="events" element={<EventManager />} />
                <Route path="calendar" element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendar View</h2>
                    <p className="text-gray-600">Admin calendar view coming soon...</p>
                  </div>
                } />
                <Route path="photos" element={<PhotoUpload />} />
                <Route path="success-stories" element={<SuccessStoriesManager />} />
                <Route path="travel" element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Coordination</h2>
                    <p className="text-gray-600">Travel coordination management coming soon...</p>
                  </div>
                } />
                <Route path="forms" element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Editor</h2>
                    <p className="text-gray-600">Registration form editor coming soon...</p>
                  </div>
                } />
                <Route path="content" element={<ContentManager />} />
                <Route path="registration" element={<RegistrationManager />} />
                <Route path="user-manager" element={<UserManager />} />
              </Route>

              {/* Public routes (with navbar/footer) */}
              <Route path="/*" element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/sessions" element={<Sessions />} />
                      <Route path="/mentors" element={<Mentors />} />
                      <Route path="/contact" element={<Contact />} />
                      
                      {/* 404 page */}
                      <Route path="*" element={
                        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                              Page Not Found
                            </h2>
                            <p className="text-gray-600 mb-8">
                              The page you're looking for doesn't exist.
                            </p>
                            <a
                              href="/"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                              Back to Home
                            </a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </SiteConfigProvider>
    </AuthProvider>
  )
}

export default App
