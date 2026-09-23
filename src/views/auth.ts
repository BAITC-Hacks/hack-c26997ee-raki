import type { AuthError } from '@supabase/supabase-js'
import { getConfiguredRedirectUrl, isSupabaseConfigured, supabase } from '../lib/supabase'
import { navigate, type Route } from '../lib/router'

type AuthMode = 'login' | 'signup'

function authCopy(mode: AuthMode): { eyebrow: string; title: string; description: string; action: string } {
  return mode === 'login'
    ? {
        eyebrow: 'Welcome back',
        title: 'Sign in to your workspace',
        description: 'Pick up where you left off and keep your city moving forward.',
        action: 'Sign in',
      }
    : {
        eyebrow: 'Get started',
        title: 'Create your account',
        description: 'Build a clearer picture of your city in a few simple steps.',
        action: 'Create account',
      }
}

export function renderAuth(root: HTMLElement, route: Route): void {
  const mode: AuthMode = route === 'signup' ? 'signup' : 'login'
  const copy = authCopy(mode)
  const alternateMode: AuthMode = mode === 'login' ? 'signup' : 'login'
  const alternateLabel = mode === 'login' ? 'Create an account' : 'Sign in instead'

  root.innerHTML = `
    <main class="auth-shell">
      <section class="auth-intro" aria-label="Product introduction">
        <a class="brand" href="#/login" aria-label="Akim home">
          <span class="brand-mark">A</span>
          <span>Abeke</span>
        </a>
        <div class="intro-content">
          <p class="kicker">City decisions, made clearer.</p>
          <h1>Turn five hours into meaningful progress.</h1>
          <p class="intro-text">A calm command center for choosing what matters most, understanding trade-offs, and moving your city forward.</p>
          <div class="intro-stats" aria-label="Product highlights">
            <div><strong>24/7</strong><span>city context</span></div>
            <div><strong>5 min</strong><span>to your first decision</span></div>
          </div>
        </div>
        <p class="intro-footer">Designed for people who make places better.</p>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <div class="mobile-brand brand"><span class="brand-mark">A</span><span>Abeke</span></div>
          <div class="auth-heading">
            <p class="eyebrow">${copy.eyebrow}</p>
            <h2>${copy.title}</h2>
            <p>${copy.description}</p>
          </div>

          <div class="auth-tabs" role="tablist" aria-label="Account access">
            <a class="auth-tab${mode === 'login' ? ' active' : ''}" href="#/login" role="tab" aria-selected="${mode === 'login'}">Sign in</a>
            <a class="auth-tab${mode === 'signup' ? ' active' : ''}" href="#/signup" role="tab" aria-selected="${mode === 'signup'}">Create account</a>
          </div>

          <form id="auth-form" class="auth-form">
            <label for="email">Email address</label>
            <input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />

            <div class="password-label-row">
              <label for="password">Password</label>
              ${mode === 'login' ? '<span class="field-hint">Use your account password</span>' : '<span class="field-hint">8+ characters</span>'}
            </div>
            <div class="password-wrap">
              <input id="password" name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" placeholder="Enter your password" minlength="8" required />
              <button class="password-toggle" id="password-toggle" type="button" aria-label="Show password">Show</button>
            </div>

            <div id="auth-message" class="form-message" role="status" aria-live="polite"></div>
            <button id="auth-submit" class="primary-button" type="submit">${copy.action}<span aria-hidden="true">→</span></button>
          </form>

          <p class="auth-switch">${mode === 'login' ? 'New to Abeke?' : 'Already have an account?'} <a href="#/${alternateMode}">${alternateLabel}</a></p>
          ${!isSupabaseConfigured ? '<p class="setup-note"><span class="status-dot"></span> Add your Supabase keys to enable authentication.</p>' : ''}
        </div>
        <p class="legal-copy">By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
      </section>
    </main>
  `

  const form = root.querySelector<HTMLFormElement>('#auth-form')!
  const submitButton = root.querySelector<HTMLButtonElement>('#auth-submit')!
  const message = root.querySelector<HTMLDivElement>('#auth-message')!
  const passwordInput = root.querySelector<HTMLInputElement>('#password')!
  const passwordToggle = root.querySelector<HTMLButtonElement>('#password-toggle')!

  passwordToggle.addEventListener('click', () => {
    const showing = passwordInput.type === 'text'
    passwordInput.type = showing ? 'password' : 'text'
    passwordToggle.textContent = showing ? 'Show' : 'Hide'
    passwordToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password')
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!supabase) {
      setMessage(message, 'Authentication is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.', 'error')
      return
    }

    setBusy(submitButton, true, mode === 'login' ? 'Signing in…' : 'Creating…')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: getConfiguredRedirectUrl() } })

    if (result.error) {
      setBusy(submitButton, false, copy.action)
      setMessage(message, friendlyError(result.error), 'error')
      return
    }

    if (mode === 'signup' && !result.data.session) {
      setBusy(submitButton, false, copy.action)
      setMessage(message, 'Account created. Check your email to confirm your account, then sign in.', 'success')
      return
    }

    navigate('app')
  })
}

function setBusy(button: HTMLButtonElement, busy: boolean, label: string): void {
  button.disabled = busy
  button.innerHTML = busy ? `<span class="spinner" aria-hidden="true"></span>${label}` : `${label}<span aria-hidden="true">→</span>`
}

function setMessage(element: HTMLElement, text: string, kind: 'error' | 'success'): void {
  element.className = `form-message visible ${kind}`
  element.textContent = text
}

function friendlyError(error: AuthError): string {
  const knownMessages: Record<string, string> = {
    'Invalid login credentials': 'That email and password combination is not correct.',
    'User already registered': 'An account with this email already exists. Try signing in.',
    'Email not confirmed': 'Please confirm your email address before signing in.',
  }
  return knownMessages[error.message] ?? error.message
}
