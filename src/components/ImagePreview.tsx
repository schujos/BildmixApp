interface ImagePreviewProps {
  src: string
  alt: string
  onRemove: () => void
}

export function ImagePreview({ src, alt, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-sm font-bold text-slate-300 transition-colors hover:bg-red-500 hover:text-white"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  )
}
