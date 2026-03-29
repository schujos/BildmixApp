import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { UploadedImage } from '../types'
import { ImagePreview } from './ImagePreview'
import { formatFileSize } from '../utils/fileValidation'

interface UploadCardProps {
  label: string
  sublabel: string
  uploaded: UploadedImage | null
  validationError: string | null
  onFiles: (files: File[]) => void
  onRemove: () => void
  disabled?: boolean
}

export function UploadCard({
  label,
  sublabel,
  uploaded,
  validationError,
  onFiles,
  onRemove,
  disabled = false,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  // Track drag counter to avoid flicker when cursor moves over child elements
  const dragCounter = useRef(0)

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFiles(Array.from(e.target.files))
    // Reset value so the same file can be re-selected
    e.target.value = ''
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFiles(files)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        {uploaded && (
          <span className="text-xs text-slate-500">{formatFileSize(uploaded.file.size)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={[
          'relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200',
          uploaded
            ? 'border-slate-700'
            : isDragging
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-dashed border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/50',
          disabled ? 'pointer-events-none opacity-50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {uploaded ? (
          <ImagePreview src={uploaded.previewUrl} alt={label} onRemove={onRemove} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {/* Upload icon */}
            <div
              className={`rounded-full p-3 ${isDragging ? 'bg-violet-500/20' : 'bg-slate-800'}`}
            >
              <svg
                className={`h-6 w-6 ${isDragging ? 'text-violet-400' : 'text-slate-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            <div>
              <p
                className={`text-sm font-medium ${isDragging ? 'text-violet-300' : 'text-slate-300'}`}
              >
                {isDragging ? 'Drop to upload' : 'Drop or click to upload'}
              </p>
              <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
            </div>

            <p className="text-xs text-slate-600">JPEG · PNG · WebP · max 10 MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleChange}
          tabIndex={-1}
        />
      </div>

      {/* Validation error */}
      {validationError && <p className="px-1 text-xs text-red-400">{validationError}</p>}
    </div>
  )
}
