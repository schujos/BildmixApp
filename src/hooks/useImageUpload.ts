import { useState, useCallback, useEffect } from 'react'
import { UploadedImage } from '../types'
import { validateImageFile } from '../utils/fileValidation'

interface UseImageUploadReturn {
  uploaded: UploadedImage | null
  validationError: string | null
  handleFiles: (files: FileList | File[]) => void
  clear: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Revoke the object URL when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (uploaded?.previewUrl) URL.revokeObjectURL(uploaded.previewUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploaded?.previewUrl])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.isArray(files) ? files[0] : files[0]
    if (!file) return

    const error = validateImageFile(file)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError(null)
    setUploaded((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl)
      return { file, previewUrl: URL.createObjectURL(file) }
    })
  }, [])

  const clear = useCallback(() => {
    setUploaded((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl)
      return null
    })
    setValidationError(null)
  }, [])

  return { uploaded, validationError, handleFiles, clear }
}
