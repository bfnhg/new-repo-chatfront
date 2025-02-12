// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // Check both auth.user and localStorage
    const userData = window.localStorage.getItem('userData')
    const accessToken = window.localStorage.getItem('accessToken')

    if (!auth.user && !userData && !accessToken) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    } else {
      setIsAuthenticated(true)
    }
  }, [router,router.isReady, router.asPath, auth.user])

  // Si l'authentification est en cours, montrez le fallback
  if (auth.loading || !isAuthenticated) {
    return fallback
  }

  // Si authentifié, montrez le contenu protégé
  return <>{children}</>
}

export default AuthGuard
