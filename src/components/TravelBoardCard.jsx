const TravelBoardCard = ({ event, onToggle, isActive }) => {
  if (!event || event.type !== 'offline') return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-secondary-50 rounded-lg">
            <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l.5-2H3V5h16v8h-3.55l.5 2H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-bold text-gray-900">
              Travel Coordination
            </h3>
            <p className="text-sm text-gray-600">
              Coordinate rides for offline events
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isActive 
              ? 'bg-secondary-100 text-secondary-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isActive ? "M6 18L18 6M6 6l12 12" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      {/* Next Event Info */}
      <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
          <h4 className="font-medium text-secondary-900 text-sm">
            Next Offline Event
          </h4>
        </div>
        <p className="text-secondary-700 text-base font-medium mb-1">{event.topic}</p>
        <p className="text-secondary-600 text-sm">
          {event.venue} • {new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span>Ride Offers</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span>Ride Requests</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onToggle}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
      >
        {isActive ? 'Hide Travel Board' : 'Open Travel Board'}
      </button>

      {/* Quick Help */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Travel Safety</p>
            <p>Always verify identity and meet in public places when coordinating rides.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelBoardCard 