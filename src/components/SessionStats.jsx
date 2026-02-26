const SessionStats = ({ stats }) => {
  const defaultStats = [
    {
      value: "127+",
      label: "Total Sessions",
      subtitle: "Since 2021",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
      ),
      color: "text-primary-600",
      bgColor: "bg-primary-50"
    },
    {
      value: "1,200+",
      label: "Total Attendees",
      subtitle: "Across all sessions",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      ),
      color: "text-secondary-600",
      bgColor: "bg-secondary-50"
    },
    {
      value: "4.8★",
      label: "Average Rating",
      subtitle: "Member feedback",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      value: "24",
      label: "Offline Events",
      subtitle: "Community meetups",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
      ),
      color: "text-accent-600",
      bgColor: "bg-accent-50"
    }
  ]

  const statsToShow = stats || defaultStats

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Session Statistics
        </h2>
        <p className="text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
          Track our community's growth and engagement through speaking sessions
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsToShow.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </div>
            
            <div className="text-base font-medium text-gray-900 mb-1">
              {stat.label}
            </div>
            
            <div className="text-sm text-gray-500">
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {statsToShow.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-[280px] flex-shrink-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-base font-medium text-gray-900">
                    {stat.label}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SessionStats 