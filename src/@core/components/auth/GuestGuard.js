// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from '../../../hooks/useAuth'

// export default GuestGuard
const GuestGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (auth.user) {
      router.replace('/')
    }
  }, [auth.user, router.route])

  if (auth.loading || auth.user) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard