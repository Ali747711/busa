const SessionCard = ({ session, onClick }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get icon based on session type
  const getTypeIcon = (type) => {
    if (type === 'zoom') {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
      )
    } else {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      )
    }
  }

  // Get styling based on session type
  const getTypeStyles = (type) => {
    if (type === 'zoom') {
      return {
        badge: 'bg-primary-100 text-primary-700 border-primary-200',
        icon: 'text-primary-600',
        border: 'border-l-primary-500'
      }
    } else {
      return {
        badge: 'bg-secondary-100 text-secondary-700 border-secondary-200',
        icon: 'text-secondary-600',
        border: 'border-l-secondary-500'
      }
    }
  }

  const styles = getTypeStyles(session.type)

  return (
    <div 
      className={`card border-l-4 ${styles.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-4">
        {/* Header with type badge and date */}
        <div className="flex items-start justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.badge}`}>
            <span className={`mr-2 ${styles.icon}`}>
              {getTypeIcon(session.type)}
            </span>
            {session.type === 'zoom' ? 'Online Session' : 'Offline Event'}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">{formatDate(session.date)}</div>
            <div className="text-sm font-medium text-gray-900">{formatTime(session.date)}</div>
          </div>
        </div>

        {/* Topic/Title */}
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
            {session.topic}
          </h3>
          
          {/* Venue/Platform info */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className={`mr-2 ${styles.icon}`}>
              {session.type === 'zoom' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              )}
            </span>
            {session.venue || session.platform}
          </div>
        </div>

        {/* Summary */}
        <div>
          <p className="text-gray-700 leading-relaxed">
            {session.summary}
          </p>
        </div>

        {/* Stats/Attendance */}
        {session.attendance && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                {session.attendance} attended
              </span>
              
              {session.duration && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  {session.duration}
                </span>
              )}
            </div>

            {/* Rating/Feedback */}
            {session.rating && (
              <div className="flex items-center">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optional: Photos/Gallery Link */}
        {session.photos && (
          <div className="pt-2">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200">
              View Photos →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionCard 