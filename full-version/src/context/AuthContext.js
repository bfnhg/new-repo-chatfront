// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      if (storedToken) {
        try {
          // Vérifier le token avec le backend
          const response = await axios.get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })

          // Si le token est valide, mettre à jour l'état de l'utilisateur
          setUser(response.data.user)
          setLoading(false)
        } catch (err) {
          // Si le token est invalide, supprimer les données du localStorage
          console.error('Token validation failed:', err)
          localStorage.removeItem(authConfig.storageTokenKeyName)
          localStorage.removeItem('userData')
          setUser(null)
          setLoading(false)

          // Rediriger vers la page de login si nécessaire
          if (!router.pathname.includes('login')) {
            router.replace('/login')
          }
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [router])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const { token, user } = response.data // Extraction correcte des données

        if (!token || !user) {
          throw new Error('Token or user data missing in response')
        }

        // Stocker le token dans le localStorage
        window.localStorage.setItem(authConfig.storageTokenKeyName, token)

        // Stocker les données utilisateur dans le localStorage
        window.localStorage.setItem('userData', JSON.stringify(user))

        // Mettre à jour l'état de l'utilisateur
        setUser(user)

        // Rediriger l'utilisateur en fonction de son rôle
        const returnUrl = router.query.returnUrl

        let redirectURL = '/' // Par défaut, rediriger vers la page d'accueil

        if (user.role === 'client') {
          redirectURL = '/dashboards/crmclient' // Rediriger les clients vers CRM Client
        } else if (user.role === 'admin') {
          redirectURL = '/dashboards/analytics' // Rediriger les admins vers Analytics
        }

        // Si un returnUrl est spécifié, l'utiliser (sauf pour les rôles spécifiques)
        if (returnUrl && returnUrl !== '/') {
          redirectURL = returnUrl
        }

        // Rediriger l'utilisateur
        router.replace(redirectURL)
      })
      .catch(err => {
        console.error('Erreur de connexion :', err)

        // Supprimer les données invalides du localStorage
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.localStorage.removeItem('userData')

        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
