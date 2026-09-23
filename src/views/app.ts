import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { navigate } from '../lib/router'

export function renderApp(root: HTMLElement, user: User | null): void {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const firstName = name.split(' ')[0]
  const safeFirstName = escapeHtml(firstName)
  const safeEmail = escapeHtml(user?.email ?? '')

  root.innerHTML = `
    <main class="app-shell">
      <header class="app-header">
        <a class="brand" href="#/app" aria-label="Akim home"><span class="brand-mark">A</span><span>akim</span></a>
        <div class="user-menu">
          <span class="user-email">${safeEmail}</span>
          <button id="sign-out" class="outline-button" type="button">Sign out</button>
        </div>
      </header>
      <section class="dashboard-hero">
        <p class="kicker">Your city, your next move.</p>
        <h1>Good to see you, ${safeFirstName}.</h1>
        <p>Start with one decision. We’ll help you see the impact before you make it.</p>
        <button class="primary-button dashboard-button" type="button">Start a city session <span aria-hidden="true">→</span></button>
      </section>
      <section class="dashboard-grid" aria-label="Workspace overview">
        <article class="dashboard-card accent-card"><span class="card-number">01</span><h2>Choose a focus</h2><p>Select the area where your city needs attention today.</p><button type="button" class="text-button">Explore priorities <span>→</span></button></article>
        <article class="dashboard-card"><span class="card-number">02</span><h2>See the trade-offs</h2><p>Understand how one decision can ripple across your districts.</p><button type="button" class="text-button">View signals <span>→</span></button></article>
        <article class="dashboard-card"><span class="card-number">03</span><h2>Make it count</h2><p>Turn context into a clear next step your team can act on.</p><button type="button" class="text-button">Open toolkit <span>→</span></button></article>
      </section>
    </main>
  `

  root.querySelector<HTMLButtonElement>('#sign-out')!.addEventListener('click', async () => {
    await supabase?.auth.signOut()
    navigate('login')
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
