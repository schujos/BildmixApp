export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-slate-950/85 backdrop-blur-sm">
      <svg
        className="h-12 w-12 animate-spin text-violet-500"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <p className="font-medium text-slate-50">Processing your images…</p>
        <p className="mt-1 text-sm text-slate-400">This may take up to 90 seconds</p>
      </div>
    </div>
  )
}
