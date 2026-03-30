import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

type Mode = 'login' | 'register'

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await signUp(email, password, name)
        setSuccessMsg('Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse.')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-slate-50 text-center mb-2">Virtual Try-On</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          {mode === 'login' ? 'Melde dich an, um fortzufahren.' : 'Erstelle ein neues Konto.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Max Mustermann"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {successMsg && (
            <p className="text-sm text-green-400 bg-green-950/40 border border-green-800 rounded-lg px-4 py-2.5">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {loading ? 'Bitte warten…' : mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>Noch kein Konto?{' '}
              <button onClick={() => { setMode('register'); setError(null); setSuccessMsg(null) }}
                className="text-indigo-400 hover:text-indigo-300 font-medium">
                Registrieren
              </button>
            </>
          ) : (
            <>Bereits registriert?{' '}
              <button onClick={() => { setMode('login'); setError(null); setSuccessMsg(null) }}
                className="text-indigo-400 hover:text-indigo-300 font-medium">
                Anmelden
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
