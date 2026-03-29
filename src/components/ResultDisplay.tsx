interface ResultDisplayProps {
  resultUrl: string
}

export function ResultDisplay({ resultUrl }: ResultDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-2xl ring-1 ring-slate-700 shadow-[0_0_60px_rgba(139,92,246,0.12)]">
        <img
          src={resultUrl}
          alt="Generated try-on result"
          className="h-auto max-h-[80vh] w-full object-contain"
        />
      </div>
      <a
        href={resultUrl}
        download="try-on-result.jpg"
        className="text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-violet-400"
      >
        Download result
      </a>
    </div>
  )
}
