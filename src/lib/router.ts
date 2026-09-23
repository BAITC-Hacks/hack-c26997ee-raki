export type Route = 'login' | 'signup' | 'app'

const routeNames: Route[] = ['login', 'signup', 'app']

export function getRoute(): Route {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return routeNames.includes(route as Route) ? (route as Route) : 'login'
}

export function navigate(route: Route): void {
  window.location.hash = `/${route}`
}

export function startRouter(onRouteChange: (route: Route) => void): () => void {
  const handleHashChange = () => onRouteChange(getRoute())
  window.addEventListener('hashchange', handleHashChange)
  handleHashChange()

  return () => window.removeEventListener('hashchange', handleHashChange)
}
