import { useState, useEffect } from 'react'
import { Search, User, Briefcase, AlertCircle } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { addProjectMemberApi } from '../../../api/project.api'
import { getAvailableUsersApi } from '../../../api/user.api'

export default function AddMemberModal({ open, onClose, projectId, onAdded }) {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    if (open) {
      loadUsers()
    }
  }, [open])

  const loadUsers = async () => {
    setLoadingUsers(true)
    setError(null)
    try {
      const data = await getAvailableUsersApi()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const displayName = user.name || user.email
    return (
      displayName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const canAddUser = (user) => {
    // Managers can be added to multiple projects
    if (user.role === 'manager') return true
    // Project managers and members can only be in one project
    return user.projects.length === 0
  }

  const submit = async () => {
    if (!selectedUser) {
      setError('Please select a user')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await addProjectMemberApi(projectId, { userId: selectedUser.id, role })
      onAdded()
      onClose()
      setSelectedUser(null)
      setSearchTerm('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (userRole) => {
    switch (userRole) {
      case 'manager':
        return 'purple'
      case 'project_manager':
        return 'blue'
      default:
        return 'gray'
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Member to Project
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select a user and assign them a role in this project
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {loadingUsers ? (
            <div className="text-center py-8 text-slate-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? 'No users found' : 'No users available'}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isAvailable = canAddUser(user)
              const displayName = user.name || user.email
              const isSelected = selectedUser?.id === user.id

              return (
                <Card
                  key={user.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isAvailable
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => isAvailable && setSelectedUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {displayName}
                          </p>
                          <Badge color={getRoleBadgeColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                        {user.projects.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-500">
                              {user.projects.map((p) => p.name).join(', ')}
                            </p>
                          </div>
                        )}
                        {!isAvailable && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            Already assigned to a project
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Role Selection */}
        {selectedUser && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="member">Member</option>
              <option value="project_manager">Project Manager</option>
              {selectedUser.role === 'manager' && <option value="manager">Manager</option>}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Select the role this user will have in this project
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading || !selectedUser}
            className="min-w-24"
          >
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
