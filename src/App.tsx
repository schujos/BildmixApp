import { useAuth } from './hooks/useAuth'
import { AuthPage } from './components/AuthPage'
import { TryOnApp } from './components/TryOnApp'

export default function App() {
  const { authState, user, signOut } = useAuth()

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-500" />
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <AuthPage />
  }

  return <TryOnApp userEmail={user?.email ?? ''} onSignOut={signOut} />
}
