import './style.css'
import { startRouter, navigate, type Route } from './lib/router'
import { supabase } from './lib/supabase'
import { renderApp } from './views/app'
import { renderAuth } from './views/auth'

const root = document.querySelector<HTMLDivElement>('#app')!

async function renderRoute(route: Route): Promise<void> {
  const session = supabase ? (await supabase.auth.getSession()).data.session : null

  if (route === 'app' && !session) {
    navigate('login')
    return
  }

  if ((route === 'login' || route === 'signup') && session) {
    navigate('app')
    return
  }

  if (route === 'app') {
    renderApp(root, session?.user ?? null)
  } else {
    renderAuth(root, route)
  }
}

startRouter((route) => {
  void renderRoute(route)
})

supabase?.auth.onAuthStateChange((_event, session) => {
  if (!session && window.location.hash === '#/app') {
    navigate('login')
  }
})
