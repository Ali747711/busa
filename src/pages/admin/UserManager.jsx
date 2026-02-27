import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Shield, UserCheck, Mail, Calendar, Edit, Save, X } from 'lucide-react'

// Inline edit row — owns its own selected role state to avoid mutating shared array items
const RoleEditor = ({ userData, isAdmin, onSave, onCancel, saving }) => {
  const [selectedRole, setSelectedRole] = useState(userData.role || 'member')

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1"
      >
        <option value="member">Member</option>
        <option value="mentor">Mentor</option>
        {isAdmin && <option value="admin">Admin</option>}
      </select>
      <button
        onClick={() => onSave(userData.id, selectedRole)}
        disabled={saving}
        className="text-green-600 hover:text-green-900 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="text-gray-600 hover:text-gray-900">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

const UserManager = () => {
  const { user, isMentor, isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [notification, setNotification] = useState(null) // { type: 'success'|'error', message }

  useEffect(() => {
    if (isMentor) fetchUsers()
    else setLoading(false)
  }, [isMentor])

  if (!isMentor) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only mentors can access user management.</p>
      </div>
    )
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3500)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(usersQuery)
      const usersData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
        lastLogin: d.data().lastLogin?.toDate()
      }))
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      showNotification('error', 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdating(true)
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date(),
        updatedBy: user.email
      })
      await fetchUsers()
      setEditingUser(null)
      showNotification('success', `Role updated to "${newRole}".`)
    } catch (error) {
      console.error('Error updating user role:', error)
      showNotification('error', 'Failed to update role. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'mentor': return 'bg-red-100 text-red-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Inline notification */}
      {notification && (
        <div className={`rounded-md px-4 py-3 text-sm font-medium ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user roles and mentor permissions
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mentors</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'mentor' || u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.role || u.role === 'member').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Logins (24h)</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => {
                  if (!u.lastLogin) return false
                  return u.lastLogin > new Date(Date.now() - 24 * 60 * 60 * 1000)
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {userData.displayName?.charAt(0) || userData.email?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userData.displayName || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {userData.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === userData.id ? (
                      <RoleEditor
                        userData={userData}
                        isAdmin={isAdmin}
                        onSave={updateUserRole}
                        onCancel={() => setEditingUser(null)}
                        saving={updating}
                      />
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userData.role)}`}>
                        {userData.role || 'member'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(userData.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(userData.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser !== userData.id && (
                      <button
                        onClick={() => setEditingUser(userData.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Role Management Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Member:</strong> Regular user with no admin access</li>
          <li>• <strong>Mentor:</strong> Can access admin dashboard and manage content</li>
          {isAdmin && <li>• <strong>Admin:</strong> Full administrative privileges — only visible to admins</li>}
          <li>• Role changes take effect on the user's next login or page refresh</li>
        </ul>
      </div>
    </div>
  )
}

export default UserManager
