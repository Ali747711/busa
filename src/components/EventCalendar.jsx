import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const EventCalendar = ({ 
  events = [],
  onDateClick = () => {},
  onEventClick = () => {},
  selectedDate,
  onDateChange = () => {},
  showLegend = true,
  variant = "default", // default, compact, minimal
  className = ""
}) => {
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date())
  
  // Use external selectedDate if provided, otherwise internal state
  const currentSelectedDate = selectedDate || internalSelectedDate
  
  const handleDateChange = (date) => {
    if (selectedDate) {
      onDateChange(date)
    } else {
      setInternalSelectedDate(date)
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => 
      event.date && event.date.startsWith(dateStr)
    )
  }

  // Handle date click
  const handleDateClick = (date) => {
    handleDateChange(date)
    const dateEvents = getEventsForDate(date)
    onDateClick(date, dateEvents)
    
    // If single event, trigger event click
    if (dateEvents.length === 1) {
      onEventClick(dateEvents[0])
    }
  }

  // Get calendar tile classes
  const getTileClassName = ({ date }) => {
    const dateEvents = getEventsForDate(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    
    let classes = []
    
    if (date.getTime() === currentSelectedDate.getTime()) {
      classes.push('selected-date')
    }
    
    if (date.getTime() === today.getTime()) {
      classes.push('today-date')
    }
    
    if (dateEvents.length === 1) {
      classes.push('has-single-event')
    } else if (dateEvents.length > 1) {
      classes.push('has-multiple-events')
    }
    
    return classes.join(' ')
  }

  // Get calendar tile content (event indicators)
  const getTileContent = ({ date }) => {
    const dateEvents = getEventsForDate(date)
    if (dateEvents.length === 1) {
      return <div className="event-indicator single-event"></div>
    } else if (dateEvents.length > 1) {
      return <div className="event-indicator multiple-events"></div>
    }
    return null
  }

  // Get variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: "bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100",
          title: "text-base sm:text-lg lg:text-xl font-heading font-bold text-gray-900 mb-3 sm:mb-4"
        }
      case 'minimal':
        return {
          container: "bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200",
          title: "text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 sm:mb-4"
        }
      default:
        return {
          container: "bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100",
          title: "text-lg sm:text-xl lg:text-2xl font-heading font-bold text-gray-900 mb-4 sm:mb-6"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`${styles.container} ${className} w-full`}>
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className={`${styles.title} mb-2 sm:mb-0`}>
          Event Calendar
        </h3>
        
        {/* Mobile calendar navigation hint */}
        <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
          Tap dates to view events
        </div>
      </div>
      
      {/* Calendar container with overflow fix */}
      <div className="calendar-container w-full overflow-hidden">
        <div className="w-full">
          <Calendar
            onChange={handleDateChange}
            value={currentSelectedDate}
            onClickDay={handleDateClick}
            tileClassName={getTileClassName}
            tileContent={getTileContent}
            // Mobile-optimized settings
            formatShortWeekday={(locale, date) => 
              new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(date)
            }
            showNeighboringMonth={false}
            minDetail="month"
            prev2Label={null}
            next2Label={null}
            prevLabel={
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            nextLabel={
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Mobile-optimized legend */}
      {showLegend && (
        <div className="mt-4 sm:mt-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Legend</h4>
            
            {/* Mobile: Stack vertically, Desktop: Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">Single Event</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">Multiple Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">Offline Event</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">Online Session</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-optimized event list for selected date */}
      {getEventsForDate(currentSelectedDate).length > 0 && (
        <div className="mt-4 sm:mt-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-primary-900 mb-3 text-sm sm:text-base">
              Events on {currentSelectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </h4>
            
            <div className="space-y-2 sm:space-y-3">
              {getEventsForDate(currentSelectedDate).map((event, index) => (
                <div 
                  key={index}
                  onClick={() => onEventClick(event)}
                  className="bg-white rounded-lg border border-primary-200 hover:border-primary-300 cursor-pointer transition-all duration-200 active:scale-98 p-3 sm:p-4"
                >
                  {/* Mobile-optimized event header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        event.type === 'zoom' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-secondary-100 text-secondary-700'
                      }`}>
                        {event.type === 'zoom' ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-xs text-gray-500 sm:hidden">
                        {event.time}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {event.time}
                    </span>
                  </div>
                  
                  {/* Event details */}
                  <h5 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 leading-snug">
                    {event.topic}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {event.venue || event.platform}
                  </p>
                  
                  {/* Mobile tap indicator */}
                  <div className="flex items-center justify-end mt-2 sm:hidden">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile quick actions */}
      {getEventsForDate(currentSelectedDate).length === 0 && (
        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm sm:text-base mb-3">
              No events on this date
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Tap other dates to view upcoming sessions
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventCalendar 