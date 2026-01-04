import { useEffect, useState } from 'react'
import { Trash, FileIcon, Upload, Download } from 'lucide-react'
import Button from '../ui/Button'
import { 
  getProjectFilesApi, 
  getTaskFilesApi, 
  uploadFileApi, 
  deleteFileApi,
  downloadFileApi 
} from '../../api/file.api'
import { useToast } from '../../hooks/useToast'

/**
 * Modular File Manager Component
 * 
 * @param {string} projectId - Required: The project ID
 * @param {string} taskId - Optional: If provided, manages task-specific files
 * @param {number} refresh - Optional: Change this value to trigger a refresh
 * @param {function} onFileChange - Optional: Callback when files are uploaded/deleted
 * @param {boolean} compact - Optional: Use compact layout (default: false)
 */
function FileManager({ 
  projectId, 
  taskId = null, 
  refresh = 0,
  onFileChange = null,
  compact = false 
}) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { showToast } = useToast()

  const isTaskContext = Boolean(taskId)

  const loadFiles = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const { data } = isTaskContext
        ? await getTaskFilesApi(projectId, taskId)
        : await getProjectFilesApi(projectId)
      setFiles(data.data || [])
    } catch (error) {
      showToast('Failed to load files', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [projectId, taskId, refresh])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadFileApi(projectId, file, taskId)
      showToast('File uploaded successfully')
      loadFiles()
      if (onFileChange) onFileChange()
      e.target.value = ''
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to upload file', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file?')) return

    setDeleting(fileId)
    try {
      await deleteFileApi(fileId)
      showToast('File deleted')
      loadFiles()
      if (onFileChange) onFileChange()
    } catch (error) {
      showToast('Failed to delete file', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const handleDownload = async (file) => {
    setDownloading(file.id)
    try {
      const response = await downloadFileApi(file.id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      showToast('Failed to download file', 'error')
    } finally {
      setDownloading(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading files…</p>
  }

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <label className="cursor-pointer inline-block mb-4 w-full">
        <Button 
          as="span" 
          variant={compact ? "secondary" : "primary"}
          className={compact ? "w-full" : ""}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
        <input
          type="file"
          hidden
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {/* Files List */}
      {files.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          {isTaskContext 
            ? 'No files attached to this task.' 
            : 'No files uploaded yet.'}
        </p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={`
                flex items-center justify-between gap-3
                p-3 rounded-lg
                border border-slate-200 dark:border-slate-700
                bg-slate-50 dark:bg-slate-800/50
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors
                ${compact ? 'gap-2' : ''}
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileIcon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`${compact ? 'text-sm' : 'text-sm'} font-medium text-slate-900 dark:text-white truncate`}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-slate-500">
                    {compact ? (
                      `${file.uploader_name || file.uploader_email} • ${formatDate(file.uploaded_at)}`
                    ) : (
                      <>
                        Uploaded by {file.uploader_name || file.uploader_email} on{' '}
                        {formatDate(file.uploaded_at)}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className={compact ? "px-2 py-1" : "px-3 py-2"}
                  disabled={downloading === file.id}
                  onClick={() => handleDownload(file)}
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  className={compact ? "px-2 py-1" : "px-3 py-2"}
                  disabled={deleting === file.id}
                  onClick={() => handleDelete(file.id)}
                  title="Delete file"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileManager
