const CallToAction = ({ 
  title = "Ready to Join Our Community?",
  description = "Connect with fellow students and enhance your speaking skills in a supportive environment.",
  primaryButton = { text: "Get Started", href: "/contact" },
  secondaryButton = null,
  variant = "default", // default, gradient, minimal, centered
  bgColor = "bg-white",
  maxWidth = "max-w-4xl",
  showStats = false,
  stats = []
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          container: "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white",
          title: "text-white",
          description: "text-primary-100",
          primaryBtn: "bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl",
          secondaryBtn: "border-white text-white hover:bg-white hover:text-primary-600"
        }
      case 'minimal':
        return {
          container: "bg-gray-50 border border-gray-200",
          title: "text-gray-900",
          description: "text-gray-600",
          primaryBtn: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
          secondaryBtn: "border-gray-300 text-gray-700 hover:bg-gray-50"
        }
      case 'centered':
        return {
          container: "bg-white border-2 border-primary-100",
          title: "text-gray-900",
          description: "text-gray-600",
          primaryBtn: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
          secondaryBtn: "border-gray-300 text-gray-700 hover:bg-gray-50"
        }
      default:
        return {
          container: bgColor + " border border-gray-100",
          title: "text-gray-900",
          description: "text-gray-600",
          primaryBtn: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
          secondaryBtn: "border-gray-300 text-gray-700 hover:bg-gray-50"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section className={`py-12 px-4 ${variant === 'centered' ? 'text-center' : ''}`}>
      <div className={`${styles.container} rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 ${maxWidth} mx-auto`}>
        <div className={`${variant === 'centered' ? 'text-center' : 'flex flex-col lg:flex-row lg:items-center lg:justify-between'}`}>
          {/* Content */}
          <div className={`${variant === 'centered' ? 'mb-8' : 'lg:flex-1 lg:pr-8 mb-6 lg:mb-0'}`}>
            <h2 className={`text-2xl md:text-3xl font-heading font-bold mb-4 ${styles.title}`}>
              {title}
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${styles.description} ${variant === 'centered' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
              {description}
            </p>

            {/* Optional Stats */}
            {showStats && stats.length > 0 && (
              <div className={`mt-6 grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-4`}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${variant === 'gradient' ? 'text-white' : 'text-primary-600'} mb-1`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${variant === 'gradient' ? 'text-primary-100' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 ${variant === 'centered' ? 'justify-center' : 'lg:flex-shrink-0'}`}>
            {/* Primary Button */}
            {primaryButton && (
              <a
                href={primaryButton.href}
                className={`${styles.primaryBtn} font-medium py-3 px-6 rounded-lg transition-all duration-200 text-center inline-block`}
                onClick={primaryButton.onClick}
              >
                {primaryButton.text}
              </a>
            )}

            {/* Secondary Button */}
            {secondaryButton && (
              <a
                href={secondaryButton.href}
                className={`border ${styles.secondaryBtn} font-medium py-3 px-6 rounded-lg transition-all duration-200 text-center inline-block`}
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction 