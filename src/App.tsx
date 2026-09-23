import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import AuthPage from './components/auth/AuthPage'
import { getRoute, navigate } from './lib/router'
import { supabase } from './lib/supabase'
import SimulatorPage from './pages/SimulatorPage'

function App() {
  const [route, setRoute] = useState(getRoute)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || loading) return
    if (session && route !== 'app') navigate('app')
    if (!session && route === 'app') navigate('login')
  }, [loading, route, session])

  if (loading) return <div className="app-loading">Загрузка…</div>
  if (supabase && !session) return <AuthPage route={route} />

  return (
    <>
      {supabase && (
        <div className="session-bar">
          <span>{session?.user.email}</span>
          <button type="button" onClick={() => void supabase?.auth.signOut()}>Выйти</button>
        </div>
      )}
      <SimulatorPage />
    </>
  )
}

export default App
