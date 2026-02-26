import { useState } from 'react'

const MentorCard = ({ 
  mentor,
  variant = "default", // default, compact, horizontal
  size = "default", // default, small, large
  showBio = true,
  showContact = true,
  showUniversity = true,
  showMajor = true,
  showRole = true,
  maxBioLines = 2,
  onClick = null,
  onContactClick = null,
  className = "",
  imageSize = null // auto-calculated based on variant/size if not provided
}) => {
  const [imageError, setImageError] = useState(false)

  // Generate initials for fallback avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-primary-500',
      'bg-secondary-500', 
      'bg-accent-500',
      'bg-success-500',
      'bg-red-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'p-4',
          layout: 'text-center',
          imageSize: imageSize || (size === 'small' ? 'w-16 h-16' : size === 'large' ? 'w-24 h-24' : 'w-20 h-20'),
          nameSize: size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl',
          spacing: 'space-y-2'
        }
      case 'horizontal':
        return {
          container: 'p-6',
          layout: 'flex items-start space-x-4 text-left',
          imageSize: imageSize || (size === 'small' ? 'w-16 h-16' : size === 'large' ? 'w-24 h-24' : 'w-20 h-20'),
          nameSize: size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl',
          spacing: 'space-y-2'
        }
      default:
        return {
          container: size === 'small' ? 'p-4' : size === 'large' ? 'p-8' : 'p-6',
          layout: 'text-center',
          imageSize: imageSize || (size === 'small' ? 'w-24 h-24' : size === 'large' ? 'w-40 h-40' : 'w-32 h-32'),
          nameSize: size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl',
          spacing: 'space-y-3'
        }
    }
  }

  const styles = getVariantStyles()

  const handleCardClick = () => {
    if (onClick) {
      onClick(mentor)
    }
  }

  const handleContactClick = (contactType, value, e) => {
    e.stopPropagation() // Prevent card click when clicking contact
    if (onContactClick) {
      onContactClick(contactType, value, mentor)
    }
  }

  const truncateBio = (text, lines) => {
    if (!maxBioLines || variant === 'compact') return text
    const words = text.split(' ')
    const maxWords = lines * 15 // Approximate words per line
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'
    }
    return text
  }

  const renderImage = () => {
    return (
      <div className={variant === 'horizontal' ? 'flex-shrink-0' : 'mb-4 md:mb-6'}>
        {mentor.photo && !imageError ? (
          <img
            src={mentor.photo}
            alt={`${mentor.name} - BUSA Speaking Club Mentor`}
            className={`${styles.imageSize} rounded-full ${variant === 'horizontal' ? '' : 'mx-auto'} object-cover border-4 border-gray-100 group-hover:border-primary-200 transition-all duration-300 shadow-lg`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${styles.imageSize} rounded-full ${variant === 'horizontal' ? '' : 'mx-auto'} flex items-center justify-center border-4 border-gray-100 group-hover:border-primary-200 transition-all duration-300 shadow-lg ${getAvatarColor(mentor.name)}`}>
            <span className={`font-bold text-white ${
              styles.imageSize.includes('w-16') ? 'text-lg' :
              styles.imageSize.includes('w-24') ? 'text-2xl' :
              styles.imageSize.includes('w-40') ? 'text-4xl' : 'text-3xl'
            }`}>
              {getInitials(mentor.name)}
            </span>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className={`${variant === 'horizontal' ? 'flex-1' : ''} ${styles.spacing}`}>
        {/* Name */}
        <h3 className={`${styles.nameSize} font-heading font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300`}>
          {mentor.name}
        </h3>

        {/* Role */}
        {showRole && mentor.role && (
          <p className={`text-primary-600 font-semibold ${
            size === 'small' ? 'text-base' : 
            size === 'large' ? 'text-xl' : 'text-lg'
          }`}>
            {mentor.role}
          </p>
        )}

        {/* University */}
        {showUniversity && mentor.university && (
          <div className={`flex items-center ${variant === 'horizontal' ? 'justify-start' : 'justify-center'} space-x-2 text-gray-600`}>
            <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span className={`font-medium ${size === 'small' ? 'text-sm' : 'text-base'}`}>
              {mentor.university}
            </span>
          </div>
        )}

        {/* Major */}
        {showMajor && mentor.major && (
          <div className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
            {mentor.major}
          </div>
        )}

        {/* Bio */}
        {showBio && mentor.bio && variant !== 'compact' && (
          <div className="pt-2 border-t border-gray-100">
            <p className={`text-gray-700 leading-relaxed ${
              size === 'small' ? 'text-xs' : 'text-sm'
            }`}>
              {truncateBio(mentor.bio, maxBioLines)}
            </p>
          </div>
        )}

        {/* Contact Links */}
        {showContact && (mentor.email || mentor.linkedin || mentor.telegram) && (
          <div className={`flex ${variant === 'horizontal' ? 'justify-start' : 'justify-center'} space-x-3 pt-3`}>
            {mentor.email && (
              <a
                href={`mailto:${mentor.email}`}
                onClick={(e) => handleContactClick('email', mentor.email, e)}
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label={`Email ${mentor.name}`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </a>
            )}
            
            {mentor.linkedin && (
              <a
                href={mentor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleContactClick('linkedin', mentor.linkedin, e)}
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label={`${mentor.name}'s LinkedIn`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                </svg>
              </a>
            )}
            
            {mentor.telegram && (
              <a
                href={mentor.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleContactClick('telegram', mentor.telegram, e)}
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label={`${mentor.name}'s Telegram`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.56c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43L15.84 9.6c.19-.17-.04-.27-.29-.1l-4.64 2.92-2-1.36c-.43-.14-.44-.43.09-.64l7.83-3.02c.36-.13.67.09.55.62z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="group">
      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={handleCardClick}
      >
        <div className={`${styles.container} ${styles.layout}`}>
          {variant === 'horizontal' ? (
            <>
              {renderImage()}
              {renderContent()}
            </>
          ) : (
            <>
              {renderImage()}
              {renderContent()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorCard 