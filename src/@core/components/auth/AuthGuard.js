// ** React Imports
import { useContext, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from '../../../hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || auth.loadingAuth) {
      return
    }
    
    const isSocio = !!auth.user || !!localStorage.getItem('userData')
    const route = router.route

    // Rutas públicas
    const publicRoutes = [
      '/login',
      '/olvidaste-contrasena',
      '/registro',
      '/404',
      '/401',
    ]

    // 🔒 Usuario no autenticado intenta acceder a ruta privada
    if (!isSocio && !publicRoutes.includes(route)) {
      router.replace('/login')
      return
    }

    // ✅ Usuario socio autenticado
    if (isSocio) {
      // Si está en página pública y logueado, redirigir al home
      if (publicRoutes.includes(route)) {
        router.replace('/')
      }
    }
  }, [router.isReady, router.route, auth.user])

  if (!router.isReady || auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard