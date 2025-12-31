import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { addProjectMemberApi } from '../../../api/project.api'

export default function AddMemberModal({ open, onClose, projectId, onAdded }) {
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      await addProjectMemberApi(projectId, { userId: Number(userId), role })
      onAdded()
      onClose()
    } catch {
      setError('Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Add Member</h2>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="space-y-4">
        <Input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border"
        >
          <option value="member">Member</option>
          <option value="project_manager">Project Manager</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading}>
          Add
        </Button>
      </div>
    </Modal>
  )
}
