import { Box, Flex, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/common/Sidebar'

interface LayoutProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function Layout({ children, requiredRole }: LayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#F7FAFC">
        <VStack spacing={4}>
          <Heading size="md" color="gray.700">Authentication Required</Heading>
          <Text color="gray.500">You need to be logged in to view this page.</Text>
          <Button 
            colorScheme="teal" 
            onClick={() => router.push('/auth/login')}
          >
            Go to Login
          </Button>
        </VStack>
      </Flex>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#F7FAFC">
        <VStack spacing={4}>
          <Heading size="md" color="gray.700">Access Denied</Heading>
          <Text color="gray.500">You do not have permission to view this page.</Text>
          <Button 
            colorScheme="teal" 
            onClick={() => {
              const portal = user.role === 'bda' ? 'employee' : user.role
              router.push(`/${portal}/dashboard`)
            }}
          >
            Go to My Dashboard
          </Button>
        </VStack>
      </Flex>
    )
  }

  return (
    <Flex minH="100vh" bg="#F7FAFC">
      <Sidebar />
      <Box ml="260px" flex={1} p={8} maxW="calc(100vw - 260px)">
        {children}
      </Box>
    </Flex>
  )
}
