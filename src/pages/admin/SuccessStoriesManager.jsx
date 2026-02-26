import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  User,
  Search,
  X,
  Upload,
  Save,
  Award
} from 'lucide-react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

// Success Stories Manager Component
export default function SuccessStoriesManager() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStory, setEditingStory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    studentName: '',
    university: '',
    major: '',
    yearOfStudy: '',
    story: '',
    achievement: '',
    rating: 5,
    photoUrl: '',
    featured: false
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const storiesQuery = query(
        collection(db, 'success-stories'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(storiesQuery)
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
      setStories(storiesData)
    } catch (error) {
      console.error('Error fetching stories:', error)
      alert('Error fetching success stories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const storyData = {
        ...formData,
        updatedAt: Timestamp.now(),
        ...(editingStory ? {} : { createdAt: Timestamp.now() })
      }

      if (editingStory) {
        await updateDoc(doc(db, 'success-stories', editingStory.id), storyData)
      } else {
        await addDoc(collection(db, 'success-stories'), storyData)
      }

      await fetchStories()
      resetForm()
      setShowModal(false)
      alert(editingStory ? 'Success story updated!' : 'Success story added!')
    } catch (error) {
      console.error('Error saving story:', error)
      alert('Error saving success story')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (story) => {
    setEditingStory(story)
    setFormData({
      studentName: story.studentName || '',
      university: story.university || '',
      major: story.major || '',
      yearOfStudy: story.yearOfStudy || '',
      story: story.story || '',
      achievement: story.achievement || '',
      rating: story.rating || 5,
      photoUrl: story.photoUrl || '',
      featured: story.featured || false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this success story?')) return

    try {
      await deleteDoc(doc(db, 'success-stories', id))
      await fetchStories()
      alert('Success story deleted!')
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Error deleting success story')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const imageRef = ref(storage, `success-stories/${Date.now()}-${file.name}`)
      await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(imageRef)
      setFormData({ ...formData, photoUrl: downloadURL })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      studentName: '',
      university: '',
      major: '',
      yearOfStudy: '',
      story: '',
      achievement: '',
      rating: 5,
      photoUrl: '',
      featured: false
    })
    setEditingStory(null)
  }

  const filteredStories = stories.filter(story =>
    story.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.story?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading success stories..." />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Success Stories Manager</h1>
          <p className="text-gray-600">Manage inspiring stories from BUSA Speaking Club members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Success Story
        </button>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <div>Total Stories: <span className="font-semibold text-gray-900">{stories.length}</span></div>
            <div>Featured: <span className="font-semibold text-primary-600">{stories.filter(s => s.featured).length}</span></div>
            <div>Avg Rating: <span className="font-semibold text-yellow-600">{stories.length ? (stories.reduce((acc, s) => acc + (s.rating || 5), 0) / stories.length).toFixed(1) : 0}</span></div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Story Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {story.photoUrl ? (
                    <img 
                      src={story.photoUrl} 
                      alt={story.studentName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {story.studentName?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{story.studentName}</h3>
                    <p className="text-sm text-gray-600">{story.university}</p>
                    {story.major && <p className="text-xs text-gray-500">{story.major}</p>}
                  </div>
                </div>
                {story.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (story.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">({story.rating || 5}/5)</span>
              </div>

              {/* Story Preview */}
              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                "{story.story}"
              </p>

              {/* Achievement */}
              {story.achievement && (
                <div className="flex items-center text-sm text-green-700 bg-green-50 rounded-lg p-2 mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  {story.achievement}
                </div>
              )}

              {/* Meta Info */}
              <div className="text-xs text-gray-500 mb-4">
                Added: {story.createdAt?.toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(story)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No stories found' : 'No success stories yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first success story'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Add Success Story
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) => setFormData({...formData, university: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="University name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major/Field of Study
                    </label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({...formData, major: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Study
                    </label>
                    <select
                      value={formData.yearOfStudy}
                      onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="graduate">Graduate</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Photo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload Photo</span>
                  </label>
                  {formData.photoUrl && (
                    <img 
                      src={formData.photoUrl} 
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Success Story */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Success Story *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Share the student's success story and how BUSA helped them..."
                />
              </div>

              {/* Achievement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Achievement
                </label>
                <input
                  type="text"
                  value={formData.achievement}
                  onChange={(e) => setFormData({...formData, achievement: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., IELTS 8.0, Scholarship Award, Job Offer"
                />
              </div>

              {/* Rating and Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <select
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Featured Story
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {uploading ? 'Saving...' : editingStory ? 'Update Story' : 'Add Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 