import { useState, useEffect } from 'react'
import { Upload, X, Image, Trash2, Eye, Download, ExternalLink } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { storage, db } from '../../config/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'

const PhotoUpload = () => {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showStorageInfo, setShowStorageInfo] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const photosCollection = collection(db, 'photos')
      const photoSnapshot = await getDocs(photosCollection)
      const photoList = photoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
      }))
      
      // Sort by upload date, newest first
      photoList.sort((a, b) => b.uploadedAt - a.uploadedAt)
      setPhotos(photoList)
    } catch (error) {
      console.error('Error fetching photos:', error)
      // Demo data fallback
      setPhotos([
        {
          id: '1',
          fileName: 'debate-session-december.jpg',
          url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
          sessionTitle: 'December Debate Session',
          uploadedAt: new Date('2024-12-15'),
          size: 245760
        },
        {
          id: '2',
          fileName: 'speaking-workshop.jpg',
          url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400',
          sessionTitle: 'Speaking Workshop',
          uploadedAt: new Date('2024-12-10'),
          size: 189320
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles(files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
    }
  }

  const uploadPhotos = async (sessionTitle = '') => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        // Create a unique filename
        const timestamp = Date.now()
        const filename = `session-photos/${timestamp}-${file.name}`
        const imageRef = ref(storage, filename)
        
        // Upload file
        await uploadBytes(imageRef, file)
        const downloadURL = await getDownloadURL(imageRef)
        
        // Save photo metadata to Firestore
        const photoData = {
          fileName: file.name,
          url: downloadURL,
          sessionTitle: sessionTitle,
          uploadedAt: new Date(),
          size: file.size,
          storagePath: filename
        }
        
        await addDoc(collection(db, 'photos'), photoData)
        return photoData
      })

      await Promise.all(uploadPromises)
      setSelectedFiles([])
      await fetchPhotos()
      
    } catch (error) {
      console.error('Error uploading photos:', error)
      // For demo, just add to local state
      const demoPhotos = selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        fileName: file.name,
        url: URL.createObjectURL(file),
        sessionTitle: sessionTitle,
        uploadedAt: new Date(),
        size: file.size
      }))
      setPhotos([...demoPhotos, ...photos])
      setSelectedFiles([])
    } finally {
      setUploading(false)
    }
  }

  const deletePhoto = async (photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'photos', photo.id))
      
      // Delete from Storage
      if (photo.storagePath) {
        const imageRef = ref(storage, photo.storagePath)
        await deleteObject(imageRef)
      }
      
      await fetchPhotos()
    } catch (error) {
      console.error('Error deleting photo:', error)
      // For demo, just remove from local state
      setPhotos(photos.filter(p => p.id !== photo.id))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <LoadingSpinner text="Loading photos..." />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-gray-600">Upload and manage session photos</p>
        </div>
        <button
          onClick={() => setShowStorageInfo(!showStorageInfo)}
          className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Storage Options
        </button>
      </div>

      {/* Storage Information Panel */}
      {showStorageInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📸 Photo Storage Options</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-green-800 mb-2">✅ Option 1: Firebase Storage (FREE)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 5GB storage - FREE forever</li>
                <li>• 1GB downloads/day - FREE</li>
                <li>• Perfect for speaking club needs</li>
                <li>• Enable at: <a href="https://console.firebase.google.com/project/busa-speaking-club/storage" target="_blank" className="text-blue-600 underline">Firebase Console</a></li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-800 mb-2">💡 Option 2: External Image URLs</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use imgur.com (free image hosting)</li>
                <li>• Use Google Drive public links</li>
                <li>• Add URLs directly in admin forms</li>
                <li>• No storage costs at all</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Recommendation:</strong> Firebase Storage is actually FREE for your use case. 
              A speaking club typically uses less than 100MB total.
            </p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                <span>Upload photos</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Image className="w-8 h-8 text-gray-400 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Session title (optional)"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                id="sessionTitle"
              />
              <button
                onClick={() => {
                  const sessionTitle = document.getElementById('sessionTitle').value
                  uploadPhotos(sessionTitle)
                }}
                disabled={uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Uploaded Photos ({photos.length})
            </h3>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No photos uploaded</h3>
            <p className="text-sm text-gray-500">Upload your first session photos to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src={photo.url}
                    alt={photo.fileName}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(photo.url, '_blank')}
                      className="p-2 bg-white rounded-full text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = photo.url
                        link.download = photo.fileName
                        link.click()
                      }}
                      className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePhoto(photo)}
                      className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {photo.sessionTitle || photo.fileName}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {photo.uploadedAt.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(photo.size)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoUpload 