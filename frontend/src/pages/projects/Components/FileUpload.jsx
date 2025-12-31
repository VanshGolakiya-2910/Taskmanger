import Button from '../../../components/ui/Button'
import { uploadFileApi } from '../../../api/file.api'

export default function FileUpload({ projectId, onUploaded }) {
  const onChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFileApi(projectId, file)
    onUploaded()
  }

  return (
    <label>
      <Button as="span">Upload file</Button>
      <input
        type="file"
        hidden
        onChange={onChange}
      />
    </label>
  )
}
