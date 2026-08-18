import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        switch (user.role) {
          case 'admin': router.push('/admin/dashboard'); break
          case 'bda': router.push('/employee/dashboard'); break
          case 'client': router.push('/client/dashboard'); break
          default: router.push('/auth/login')
        }
      }
    }
  }, [user, loading, router])

  return null
}
