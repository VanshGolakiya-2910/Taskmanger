import { useState } from 'react'
import { Loader } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { uploadFileApi } from '../../../api/file.api'
import { useToast } from '../../../hooks/useToast'

export default function FileUpload({ projectId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const { showToast } = useToast()

  const onChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadFileApi(projectId, file)
      showToast('File uploaded successfully', 'success')
      onUploaded()
      // Reset file input
      e.target.value = ''
    } catch (error) {
      showToast(error.message || 'Failed to upload file', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="cursor-pointer">
      <Button as="span" disabled={uploading}>
        {uploading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload file'
        )}
      </Button>
      <input
        type="file"
        hidden
        onChange={onChange}
        disabled={uploading}
      />
    </label>
  )
}
