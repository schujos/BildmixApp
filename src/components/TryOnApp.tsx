import { useTryOn } from '../hooks/useTryOn'
import { UploadCard } from './UploadCard'
import { GenerateButton } from './GenerateButton'
import { ResultDisplay } from './ResultDisplay'
import { LoadingOverlay } from './LoadingOverlay'
import { ErrorBanner } from './ErrorBanner'

interface TryOnAppProps {
  userEmail: string
  onSignOut: () => void
}

export function TryOnApp({ userEmail, onSignOut }: TryOnAppProps) {
  const {
    image1,
    image2,
    validationError1,
    validationError2,
    status,
    resultUrl,
    error,
    handleImage1,
    handleImage2,
    clearImage1,
    clearImage2,
    generate,
    reset,
  } = useTryOn()

  const isLoading = status === 'loading'
  const canGenerate = image1 !== null && image2 !== null && !isLoading
  const showReset = (image1 !== null || image2 !== null || resultUrl !== null) && !isLoading

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-slate-950 px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl">

          {/* ── Header ── */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-50">
              Virtual Try-On
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-400">
              Upload a photo of a person and a clothing item to see how the outfit looks.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>{userEmail}</span>
              <button
                onClick={onSignOut}
                className="text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                Abmelden
              </button>
            </div>
          </header>

          {/* ── Upload grid ── */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
            <UploadCard
              label="Image 1 — Person"
              sublabel="Photo of the person"
              uploaded={image1}
              validationError={validationError1}
              onFiles={handleImage1}
              onRemove={clearImage1}
              disabled={isLoading}
            />
            <UploadCard
              label="Image 2 — Clothing"
              sublabel="Photo of the garment"
              uploaded={image2}
              validationError={validationError2}
              onFiles={handleImage2}
              onRemove={clearImage2}
              disabled={isLoading}
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onDismiss={reset} />
            </div>
          )}

          {/* ── Actions ── */}
          <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GenerateButton disabled={!canGenerate} loading={isLoading} onClick={generate} />
            {showReset && (
              <button
                onClick={reset}
                className="px-4 py-2 text-sm text-slate-500 transition-colors hover:text-slate-300"
              >
                Reset
              </button>
            )}
          </div>

          {/* ── Result ── */}
          {status === 'success' && resultUrl && (
            <section>
              <h2 className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
                Result
              </h2>
              <ResultDisplay resultUrl={resultUrl} />
            </section>
          )}

        </div>
      </div>
    </>
  )
}
