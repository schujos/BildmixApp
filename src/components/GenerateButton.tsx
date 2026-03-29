interface GenerateButtonProps {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function GenerateButton({ disabled, loading, onClick }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="
        inline-flex items-center justify-center gap-2.5
        rounded-xl px-10 py-3.5
        text-sm font-semibold tracking-wide
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        bg-violet-500 text-white
        hover:bg-violet-400 hover:shadow-[0_0_28px_rgba(139,92,246,0.45)]
        disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none
      "
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
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
              strokeOpacity="0.3"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Generating…
        </>
      ) : (
        'Generate Try-On'
      )}
    </button>
  )
}
