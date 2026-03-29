import { useState, useRef, useCallback } from 'react'
import { AppStatus, UploadedImage } from '../types'
import { useImageUpload } from './useImageUpload'
import { submitTryOn } from '../services/webhookService'

interface UseTryOnReturn {
  image1: UploadedImage | null
  image2: UploadedImage | null
  validationError1: string | null
  validationError2: string | null
  status: AppStatus
  resultUrl: string | null
  error: string | null
  handleImage1: (files: FileList | File[]) => void
  handleImage2: (files: FileList | File[]) => void
  clearImage1: () => void
  clearImage2: () => void
  generate: () => Promise<void>
  reset: () => void
}

export function useTryOn(): UseTryOnReturn {
  const slot1 = useImageUpload()
  const slot2 = useImageUpload()

  const [status, setStatus] = useState<AppStatus>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const generate = useCallback(async () => {
    if (!slot1.uploaded || !slot2.uploaded) return

    // Revoke previous result blob URL if present
    if (resultUrl?.startsWith('blob:')) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setError(null)
    setStatus('loading')

    const controller = new AbortController()
    abortRef.current = controller
    // 90-second timeout — AI processing can be slow
    timeoutRef.current = setTimeout(() => controller.abort(), 90_000)

    try {
      const url = await submitTryOn(slot1.uploaded.file, slot2.uploaded.file, controller.signal)
      setResultUrl(url)
      setStatus('success')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out after 90 seconds. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      }
      setStatus('error')
    } finally {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [slot1.uploaded, slot2.uploaded, resultUrl])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (resultUrl?.startsWith('blob:')) URL.revokeObjectURL(resultUrl)
    slot1.clear()
    slot2.clear()
    setStatus('idle')
    setResultUrl(null)
    setError(null)
  }, [slot1, slot2, resultUrl])

  return {
    image1: slot1.uploaded,
    image2: slot2.uploaded,
    validationError1: slot1.validationError,
    validationError2: slot2.validationError,
    status,
    resultUrl,
    error,
    handleImage1: slot1.handleFiles,
    handleImage2: slot2.handleFiles,
    clearImage1: slot1.clear,
    clearImage2: slot2.clear,
    generate,
    reset,
  }
}
