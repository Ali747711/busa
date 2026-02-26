import { Link } from 'react-router-dom'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import { Mail, MapPin, Phone, ExternalLink, Heart } from 'lucide-react'

const Footer = () => {
  const { config } = useSiteConfig()

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Mentors', href: '/mentors' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    {
      name: 'Telegram',
      href: config.telegram?.startsWith('@') ? `https://t.me/${config.telegram.slice(1)}` : 'https://t.me/busa_speak',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.56c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43L15.84 9.6c.19-.17-.04-.27-.29-.1l-4.64 2.92-2-1.36c-.43-.14-.44-.43.09-.64l7.83-3.02c.36-.13.67.09.55.62z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: config.instagramUrl || 'https://instagram.com/busa_speak',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: config.youtubeUrl || 'https://youtube.com/@busaspeakingclub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Branding Section - Left */}
          <div className="text-left">
            <div className="mb-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {config.siteTitle}
              </h3>
              <p className="text-red-500 font-semibold text-lg mb-3">
                {config.siteTagline}
              </p>
              <p className="text-gray-300 leading-relaxed max-w-sm">
                {config.missionStatement}
              </p>
            </div>
          </div>

          {/* Navigation Section - Center */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto lg:mx-0">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 py-1 text-sm lg:text-base group flex items-center"
                >
                  <span>{link.name}</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info Section - Right */}
          <div className="text-left lg:text-right">
            <h4 className="text-lg font-semibold text-white mb-6">
              Contact Information
            </h4>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center lg:justify-end">
                <div className="flex items-center space-x-3 lg:flex-row-reverse lg:space-x-reverse">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Mail className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="lg:text-right">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <a
                      href={`mailto:${config.email}`}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm lg:text-base"
                    >
                      {config.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center lg:justify-end">
                <div className="flex items-center space-x-3 lg:flex-row-reverse lg:space-x-reverse">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Phone className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="lg:text-right">
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <a
                      href={`tel:${config.phone}`}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm lg:text-base"
                    >
                      {config.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center lg:justify-end">
                <div className="flex items-center space-x-3 lg:flex-row-reverse lg:space-x-reverse">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="lg:text-right">
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-gray-300 text-sm lg:text-base">
                      {config.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} {config.siteTitle}. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Uzbek students in Korea.</span>
            </div>
            
            {/* Policy Links & Social Icons */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
              {/* Policy Links */}
              <div className="flex items-center space-x-4 text-sm">
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
              
              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-gray-800 rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 