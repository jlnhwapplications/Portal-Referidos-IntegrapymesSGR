// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from '../../../hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    // Si el usuario no está autenticado y no se encuentra en la página de inicio de sesión, redirigirlo.
    if (
      auth.user === null &&
      !window.localStorage.getItem('userData') &&
      router.route !== '/login' &&
      router.route !== '/olvidaste-contrasena' &&
      router.route !== '/registro' &&
      router.route !== '/solicitud-alta' &&
      router.route !== '/404' &&
      router.route !== '/401'
    ) {
      router.replace('/login'); // Redirigir a la página de error 401 en caso de no autenticación
    }
  }, [router.isReady, router.route, auth.user])

  if (!router.isReady || auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard