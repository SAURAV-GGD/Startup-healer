import { useState } from 'react'
import {
  Box, Button, Flex, FormControl, FormLabel, Heading, Input,
  Text, VStack, useToast, Icon, InputGroup, InputLeftElement,
  Tab, TabList, Tabs, FormErrorMessage, Image,
} from '@chakra-ui/react'
import { FiMail, FiLock, FiShield, FiUsers, FiBriefcase } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

const portals = [
  { key: 'admin', label: 'Admin', icon: FiShield, desc: 'Manage clients, employees & tasks' },
  { key: 'employee', label: 'Employee', icon: FiUsers, desc: 'View tasks, targets & attendance' },
  { key: 'client', label: 'Client', icon: FiBriefcase, desc: 'Track services & documents' },
]

export default function LoginPage() {
  const [portal, setPortal] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const toast = useToast()
  const { login } = useAuth()

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 4) newErrors.password = 'Password must be at least 4 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(email, password, portal)
      toast({ title: 'Login successful', status: 'success', duration: 2000 })
    } catch (err: any) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex minH="100vh" bg="#F7FAFC">
      {/* Left side - Branding */}
      <Flex
        w="45%"
        display={{ base: 'none', lg: 'flex' }}
        bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
        direction="column"
        justify="center"
        align="center"
        p={12}
        position="relative"
        overflow="hidden"
      >
        <Box position="relative" zIndex={1} textAlign="center">
          <Flex align="center" justify="center" gap={4} mb={8}>
            <Image src="/logo.png" alt="Startup Healer" h="80px" objectFit="contain" />
          </Flex>
          <Heading size="lg" color="white" mb={4} fontWeight="700">
            Client Management Portal
          </Heading>
          <Text color="whiteAlpha.800" fontSize="md" maxW="350px" mx="auto" lineHeight="1.7">
            Manage clients, track tasks, monitor performance, and streamline your business operations — all in one place.
          </Text>
        </Box>
        {/* Decorative circles */}
        <Box position="absolute" top="-80px" right="-80px" w="250px" h="250px" borderRadius="full" bg="rgba(255,255,255,0.05)" />
        <Box position="absolute" bottom="-60px" left="-60px" w="200px" h="200px" borderRadius="full" bg="rgba(255,255,255,0.05)" />
      </Flex>

      {/* Right side - Login form */}
      <Flex flex={1} align="center" justify="center" p={8}>
        <Box w="full" maxW="420px">
          <Box mb={8}>
            <Heading size="lg" color="navy.500" mb={2}>Welcome back</Heading>
            <Text color="gray.500">Sign in to your account to continue</Text>
          </Box>

          {/* Portal selector */}
          <Tabs
            index={portals.findIndex(p => p.key === portal)}
            onChange={(i) => setPortal(portals[i].key)}
            mb={6}
            variant="unstyled"
          >
            <TabList gap={2}>
              {portals.map((p) => (
                <Tab
                  key={p.key}
                  flex={1}
                  borderRadius="10px"
                  py={3}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.500"
                  bg="gray.50"
                  border="2px solid"
                  borderColor="transparent"
                  _selected={{
                    color: 'teal.600',
                    bg: 'teal.50',
                    borderColor: 'teal.200',
                  }}
                  transition="all 0.15s"
                >
                  <Flex direction="column" align="center" gap={1}>
                    <Icon as={p.icon} fontSize="lg" />
                    <Text>{p.label}</Text>
                  </Flex>
                </Tab>
              ))}
            </TabList>
          </Tabs>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderRadius="10px"
                    bg="white"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }}
                    size="lg"
                    fontSize="sm"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    borderRadius="10px"
                    bg="white"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }}
                    size="lg"
                    fontSize="sm"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                w="full"
                size="lg"
                fontSize="sm"
                bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
                color="white"
                borderRadius="10px"
                isLoading={loading}
                _hover={{
                  bg: 'linear-gradient(135deg, #4e9139 0%, #278a7c 50%, #178fbd 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
                _active={{ transform: 'translateY(0)' }}
              >
                Sign In as {portals.find(p => p.key === portal)?.label}
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt={6} fontSize="xs" color="gray.400">
            Credentials are provided by your administrator
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
