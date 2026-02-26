import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HeroSection = ({
  // Content props
  title = "Connect, Speak, Thrive: Uzbek Voices in Korea",
  subtitle = "Empowering Uzbek students in Korea through speech and connection.",
  currentCaption = null, // If provided, overrides carousel captions
  
  // Button props
  primaryButton = {
    text: "Join Our Next Session",
    action: "scroll", // "scroll", "link", "function"
    target: "#join-section",
    scrollToId: "join-section"
  },
  secondaryButton = {
    text: "Learn More About BUSA",
    action: "link",
    target: "/about"
  },
  
  // Layout props
  showCarousel = true,
  showStats = true,
  showScrollIndicator = true,
  variant = "default", // default, simple, minimal
  height = "min-h-screen",
  
  // Background props
  carouselImages = null, // Custom images array
  backgroundVideo = null, // Video source
  backgroundColor = null, // Solid background color
  backgroundGradient = "from-primary-600/80 via-primary-500/70 to-primary-700/80",
  
  // Stats props
  stats = [
    { value: "50+", label: "Active Members" },
    { value: "3x", label: "Monthly Zoom Sessions" },
    { value: "1x", label: "Monthly Offline Debate" }
  ],
  
  // Callback functions
  onPrimaryButtonClick = null,
  onSecondaryButtonClick = null
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Default carousel images
  const defaultCarouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1920&h=1080&fit=crop',
      alt: 'Beautiful Uzbekistan landscape',
      caption: 'Heritage from Uzbekistan'
    },
    {
      url: 'https://images.unsplash.com/photo-1543832923-44667a44c804?w=1920&h=1080&fit=crop',
      alt: 'Seoul, South Korea cityscape',
      caption: 'Future in Korea'
    },
    {
      url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1920&h=1080&fit=crop',
      alt: 'Students in discussion',
      caption: 'Building Connections'
    }
  ]

  const imagesToUse = carouselImages || defaultCarouselImages

  // Auto-advance carousel
  useEffect(() => {
    if (!showCarousel || imagesToUse.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagesToUse.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [imagesToUse.length, showCarousel])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imagesToUse.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length)
  }

  const handlePrimaryButtonClick = (e) => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick(e)
      return
    }

    if (primaryButton.action === "scroll" && primaryButton.scrollToId) {
      e.preventDefault()
      const element = document.getElementById(primaryButton.scrollToId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSecondaryButtonClick = (e) => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick(e)
    }
  }

  const renderBackground = () => {
    if (backgroundColor) {
      return <div className={`absolute inset-0 ${backgroundColor}`}></div>
    }

    if (backgroundVideo) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className={`absolute inset-0 bg-gradient-to-r ${backgroundGradient}`}></div>
        </div>
      )
    }

    if (showCarousel && imagesToUse.length > 0) {
      return (
        <div className="absolute inset-0 w-full h-full">
          {imagesToUse.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${backgroundGradient}`}></div>
            </div>
          ))}
        </div>
      )
    }

    // Fallback gradient background
    return <div className={`absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800`}></div>
  }

  const renderCarouselControls = () => {
    if (!showCarousel || imagesToUse.length <= 1) return null

    return (
      <>
        {/* Navigation Arrows - positioned with better spacing */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all duration-200 touch-manipulation shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all duration-200 touch-manipulation shadow-lg"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </>
    )
  }

  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      {renderBackground()}

      {/* Carousel Controls */}
      {renderCarouselControls()}

      {/* Hero Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 text-center text-white">
        <div className="max-w-7xl mx-auto">
          {/* Current slide caption or custom caption */}
          {(currentCaption || (showCarousel && imagesToUse[currentSlide]?.caption)) && (
            <div className="mb-3 sm:mb-4 lg:mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {currentCaption || imagesToUse[currentSlide]?.caption}
              </span>
            </div>
          )}

          {/* Responsive title */}
          <h1 className={`font-heading font-bold mb-4 sm:mb-6 lg:mb-8 text-balance leading-tight px-2 ${
            variant === 'minimal' ? 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl' :
            variant === 'simple' ? 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl' :
            'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl'
          }`}>
            {typeof title === 'string' ? (
              <>
                {title.split(':')[0]}:{' '}
                <br className="hidden sm:block" />
                <span className="block sm:inline text-red-100 bg-gradient-to-r from-red-100 to-white bg-clip-text text-transparent">
                  {title.split(':')[1] || ''}
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-red-100 mb-6 sm:mb-8 lg:mb-10 mx-auto text-balance font-light leading-relaxed px-2 ${
              variant === 'minimal' ? 'text-base sm:text-lg lg:text-xl max-w-2xl' :
              variant === 'simple' ? 'text-lg sm:text-xl lg:text-2xl max-w-3xl' :
              'text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-4xl'
            }`}>
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 lg:space-x-6 justify-center items-center mb-8 sm:mb-12 lg:mb-16 px-2">
            {primaryButton && (
              primaryButton.action === "link" ? (
                <Link
                  to={primaryButton.target}
                  onClick={handlePrimaryButtonClick}
                  className="group w-full sm:w-auto bg-white text-primary-600 hover:bg-red-50 active:bg-red-100 font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl transition-all duration-300 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 sm:space-x-3 touch-manipulation"
                >
                  <span>{primaryButton.text}</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={handlePrimaryButtonClick}
                  className="group w-full sm:w-auto bg-white text-primary-600 hover:bg-red-50 active:bg-red-100 font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl transition-all duration-300 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 sm:space-x-3 touch-manipulation"
                >
                  <span>{primaryButton.text}</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )
            )}

            {secondaryButton && (
              <Link
                to={secondaryButton.target}
                onClick={handleSecondaryButtonClick}
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary-600 active:bg-gray-100 active:text-primary-700 font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>

          {/* Stats */}
          {showStats && stats && stats.length > 0 && (
            <div className={`grid gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto px-2 mb-8 sm:mb-12 ${
              stats.length === 1 ? 'grid-cols-1' :
              stats.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:bg-white/15 transition-all duration-200">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-red-100 text-sm sm:text-base lg:text-lg leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator - positioned to avoid overlap */}
      {showScrollIndicator && (
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
            <svg className="w-4 h-4 text-white/60 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection 