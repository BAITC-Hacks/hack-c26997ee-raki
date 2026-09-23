import { useState, type FormEvent } from 'react'
import { getConfiguredRedirectUrl, supabase } from '../../lib/supabase'
import { navigate, type Route } from '../../lib/router'
import '../../styles/auth.css'

interface AuthPageProps {
  route: Route
}

export default function AuthPage({ route }: AuthPageProps) {
  const signup = route === 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return

    setBusy(true)
    setMessage('')
    const result = signup
      ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: getConfiguredRedirectUrl() } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)

    if (result.error) {
      setMessage(result.error.message)
    } else if (signup && !result.data.session) {
      setMessage('Аккаунт создан. Подтвердите адрес электронной почты, затем войдите.')
    } else {
      navigate('app')
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-intro">
        <span className="auth-brand">Аким на 5 часов <span>· Abeke</span></span>
        <div>
          <p className="auth-eyebrow">Городской симулятор</p>
          <h1>Решения для города начинаются здесь.</h1>
          <p>Изучайте мероприятия, собирайте сценарии и оценивайте возможные изменения.</p>
        </div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={(event) => void submit(event)}>
          <p className="auth-eyebrow">{signup ? 'Новый аккаунт' : 'С возвращением'}</p>
          <h2>{signup ? 'Регистрация' : 'Вход'}</h2>
          <label htmlFor="auth-email">Электронная почта</label>
          <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="auth-password">Пароль</label>
          <input id="auth-password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
          {message && <p className="auth-message" role="status">{message}</p>}
          <button type="submit" disabled={busy}>{busy ? 'Подождите…' : signup ? 'Создать аккаунт' : 'Войти'}</button>
          <p className="auth-switch">
            {signup ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
            <a href={signup ? '#/login' : '#/signup'} onClick={() => setMessage('')}>
              {signup ? 'Войти' : 'Зарегистрироваться'}
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}
