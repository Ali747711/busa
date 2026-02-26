import { useState } from 'react'

const EventModal = ({ isOpen, onClose, event }) => {
  const [isRSVPing, setIsRSVPing] = useState(false)
  const [hasRSVPed, setHasRSVPed] = useState(false)

  if (!isOpen || !event) return null

  // Format date and time
  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatEventTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Handle RSVP
  const handleRSVP = async () => {
    setIsRSVPing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRSVPing(false)
      setHasRSVPed(true)
    }, 1000)
  }

  // Get icon based on event type
  const getEventIcon = (type) => {
    if (type === 'zoom') {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      )
    }
  }

  // Get styling based on event type
  const getEventStyles = (type) => {
    if (type === 'zoom') {
      return {
        gradient: 'from-primary-500 to-primary-600',
        badge: 'bg-primary-100 text-primary-700',
        button: 'btn-primary'
      }
    } else {
      return {
        gradient: 'from-secondary-500 to-secondary-600',
        badge: 'bg-secondary-100 text-secondary-700',
        button: 'btn-secondary'
      }
    }
  }

  // Generate Google Maps embed URL
  const getGoogleMapsEmbedUrl = (address, venue) => {
    const query = encodeURIComponent(`${venue}, ${address}`)
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${query}`
  }

  // Generate Google Maps directions URL
  const getDirectionsUrl = (address, venue) => {
    const query = encodeURIComponent(`${venue}, ${address}`)
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`
  }

  const styles = getEventStyles(event.type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${styles.gradient} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-white">
                {getEventIcon(event.type)}
              </div>
              <div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles.badge}`}>
                  {event.type === 'zoom' ? 'Online Session' : 'Offline Event'}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-2xl font-heading font-bold mt-4 mb-2">
            {event.topic}
          </h2>
          
          <div className="text-white/90">
            {formatEventDate(event.date)} at {formatEventTime(event.date)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">About This Session</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-4">
            {/* Location/Platform */}
            <div className="flex items-start space-x-3">
              <div className="text-gray-400 mt-1">
                {event.type === 'zoom' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {event.type === 'zoom' ? 'Platform' : 'Venue'}
                </div>
                <div className="text-gray-600">
                  {event.venue || event.platform}
                </div>
              </div>
            </div>

            {/* Duration */}
            {event.duration && (
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Duration</div>
                  <div className="text-gray-600">{event.duration}</div>
                </div>
              </div>
            )}

            {/* Facilitator */}
            {event.facilitator && (
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Facilitator</div>
                  <div className="text-gray-600">{event.facilitator}</div>
                </div>
              </div>
            )}

            {/* Current RSVPs */}
            {event.rsvpCount !== undefined && (
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">RSVPs</div>
                  <div className="text-gray-600">
                    {event.rsvpCount} {event.rsvpCount === 1 ? 'person' : 'people'} attending
                    {event.maxCapacity && ` (${event.maxCapacity} max)`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zoom Link or Address + Map */}
          {event.type === 'zoom' && event.zoomLink && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2">Join Link</h4>
              <div className="flex items-center justify-between">
                <code className="text-sm text-primary-700 bg-white px-2 py-1 rounded border">
                  {event.zoomLink}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(event.zoomLink)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Offline Event Location */}
          {event.type === 'offline' && event.address && (
            <div className="space-y-4">
              {/* Address Information */}
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  Location Details
                </h4>
                <div className="space-y-2">
                  <p className="text-secondary-700 font-medium">{event.venue}</p>
                  <p className="text-secondary-600 text-sm">{event.address}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={getDirectionsUrl(event.address, event.venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white text-sm font-medium rounded-lg hover:bg-secondary-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                    Get Directions
                  </a>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(`${event.venue}, ${event.address}`)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-secondary-300 text-secondary-700 text-sm font-medium rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Address
                  </button>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <h4 className="font-medium text-gray-900 p-4 pb-0 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
                  </svg>
                  Map & Location
                </h4>
                
                {/* Map placeholder - Replace with actual Google Maps embed */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 m-4 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">Google Maps integration</p>
                    <p className="text-xs mt-1 text-gray-400">API key required for live maps</p>
                  </div>
                </div>
                
                {/* Uncomment when you have Google Maps API key */}
                {/* 
                <iframe
                  className="w-full aspect-video"
                  src={getGoogleMapsEmbedUrl(event.address, event.venue)}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map to ${event.venue}`}
                ></iframe>
                */}
              </div>

              {/* Travel Coordination Teaser */}
              <div className="bg-gradient-to-r from-secondary-50 to-accent-50 border border-secondary-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l.5-2H3V5h16v8h-3.55l.5 2H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                  </svg>
                  Need a Ride?
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Coordinate transportation with other BUSA members attending this event.
                </p>
                <button
                  onClick={onClose}
                  className="text-secondary-600 hover:text-secondary-700 text-sm font-medium inline-flex items-center"
                >
                  <span>Check Travel Board</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* RSVP Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!hasRSVPed ? (
              <button
                onClick={handleRSVP}
                disabled={isRSVPing}
                className={`${styles.button} flex-1 flex items-center justify-center space-x-2 ${
                  isRSVPing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isRSVPing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>RSVPing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>RSVP</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 bg-success-100 text-success-700 font-medium py-3 px-6 rounded-lg text-center border border-success-200">
                ✓ You're attending!
              </div>
            )}
            
            <button
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal 