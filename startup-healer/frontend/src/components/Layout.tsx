import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/common/Sidebar'

interface LayoutProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function Layout({ children, requiredRole }: LayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      // Redirect to correct portal
      switch (user.role) {
        case 'admin': router.push('/admin/dashboard'); break
        case 'bda': router.push('/employee/dashboard'); break
        case 'client': router.push('/client/dashboard'); break
      }
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#F7FAFC">
        <Box
          w="40px"
          h="40px"
          borderRadius="10px"
          bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
          animation="pulse 1.5s infinite"
        />
      </Flex>
    )
  }

  if (!user) return null

  return (
    <Flex minH="100vh" bg="#F7FAFC">
      <Sidebar />
      <Box ml="260px" flex={1} p={8} maxW="calc(100vw - 260px)">
        {children}
      </Box>
    </Flex>
  )
}
