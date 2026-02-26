import { useState } from 'react'

const TravelBoard = ({ event, isVisible, onToggle }) => {
  const [posts, setPosts] = useState([
    // Sample data for demonstration
    {
      id: 1,
      type: 'offer',
      name: 'Aziz K.',
      message: 'Driving from Gangnam area, have 2 seats available. Leaving at 1:30 PM',
      from: 'Gangnam-gu',
      timestamp: '2 hours ago',
      contact: '@aziz_busa'
    },
    {
      id: 2,
      type: 'request',
      name: 'Malika U.',
      message: 'Need a ride from Hongdae area. Can contribute to gas money!',
      from: 'Hongdae',
      timestamp: '1 hour ago',
      contact: '@malika_speak'
    },
    {
      id: 3,
      type: 'offer',
      name: 'Bekzod T.',
      message: 'Taking the subway, can help anyone navigate from Myeongdong station',
      from: 'Myeongdong',
      timestamp: '30 minutes ago',
      contact: '@bekzod_events'
    }
  ])

  const [newPost, setNewPost] = useState({
    type: 'request',
    name: '',
    message: '',
    from: '',
    contact: ''
  })

  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newPost.name || !newPost.message || !newPost.from) {
      return
    }

    const post = {
      id: Date.now(),
      ...newPost,
      timestamp: 'Just now'
    }

    setPosts([post, ...posts])
    setNewPost({
      type: 'request',
      name: '',
      message: '',
      from: '',
      contact: ''
    })
    setShowForm(false)
  }

  const getPostIcon = (type) => {
    if (type === 'offer') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l.5-2H3V5h16v8h-3.55l.5 2H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
        </svg>
      )
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
        </svg>
      )
    }
  }

  const getPostStyles = (type) => {
    if (type === 'offer') {
      return {
        border: 'border-l-success-500',
        bg: 'bg-success-50',
        badge: 'bg-success-100 text-success-700',
        icon: 'text-success-600'
      }
    } else {
      return {
        border: 'border-l-secondary-500',
        bg: 'bg-secondary-50',
        badge: 'bg-secondary-100 text-secondary-700',
        icon: 'text-secondary-600'
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l.5-2H3V5h16v8h-3.55l.5 2H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-gray-900">Travel Board</h3>
            <p className="text-sm text-gray-600">Coordinate rides for {event?.venue}</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{showForm ? 'Cancel' : 'Add Travel Post'}</span>
        </button>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span>Offering Rides</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span>Need Rides</span>
          </div>
        </div>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="card mb-6 border-2 border-primary-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <h4 className="font-heading font-semibold text-gray-900">Create Travel Post</h4>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setNewPost({...newPost, type: 'request'})}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    newPost.type === 'request' 
                      ? 'bg-secondary-500 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Need Ride
                </button>
                <button
                  type="button"
                  onClick={() => setNewPost({...newPost, type: 'offer'})}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    newPost.type === 'offer' 
                      ? 'bg-success-500 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Offer Ride
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newPost.name}
                  onChange={(e) => setNewPost({...newPost, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="e.g., Aziz K."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newPost.type === 'offer' ? 'Departing From' : 'Coming From'}
                </label>
                <input
                  type="text"
                  value={newPost.from}
                  onChange={(e) => setNewPost({...newPost, from: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="e.g., Gangnam-gu, Hongdae"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={newPost.message}
                onChange={(e) => setNewPost({...newPost, message: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder={
                  newPost.type === 'offer' 
                    ? "e.g., Driving from Gangnam, have 2 seats. Leaving at 1:30 PM"
                    : "e.g., Need a ride from Hongdae area. Can contribute to gas money!"
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact (Optional)
              </label>
              <input
                type="text"
                value={newPost.contact}
                onChange={(e) => setNewPost({...newPost, contact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="e.g., @username, phone, email"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Post to Board
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05l.5-2H3V5h16v8h-3.55l.5 2H17a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No travel posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to post a ride offer or request!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create First Post
            </button>
          </div>
        ) : (
          posts.map((post) => {
            const styles = getPostStyles(post.type)
            return (
              <div
                key={post.id}
                className={`card border-l-4 ${styles.border} ${styles.bg} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${styles.badge} ${styles.icon}`}>
                      {getPostIcon(post.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                          {post.type === 'offer' ? '🚗 Offering Ride' : '🙋 Need Ride'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{post.name}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>
                      
                      <p className="text-gray-800 mb-2">{post.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span>From {post.from}</span>
                        </div>
                        
                        {post.contact && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                            <span>{post.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Travel Safety Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always verify identity before sharing rides</li>
              <li>• Meet in public places when possible</li>
              <li>• Share your travel plans with friends</li>
              <li>• Contact event organizers if you need help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelBoard 