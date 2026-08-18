import { useRouter } from 'next/router'
import { Box, Flex, Icon, Text, VStack, Divider, Image } from '@chakra-ui/react'
import {
  FiHome, FiUsers, FiBriefcase, FiCheckSquare, FiTarget,
  FiClock, FiFileText, FiCalendar, FiLogOut, FiClipboard,
  FiFolder, FiBell, FiDollarSign
} from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
  label: string
  icon: any
  href: string
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, href: '/admin/dashboard' },
  { label: 'Clients', icon: FiBriefcase, href: '/admin/clients' },
  { label: 'Employees', icon: FiUsers, href: '/admin/employees' },
  { label: 'Tasks', icon: FiCheckSquare, href: '/admin/tasks' },
  { label: 'Attendance', icon: FiCalendar, href: '/admin/attendance' },
  { label: 'Leave Requests', icon: FiClock, href: '/admin/leaves' },
  { label: 'Salary Slips', icon: FiDollarSign, href: '/admin/salary-slips' },
]

const employeeNav: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, href: '/employee/dashboard' },
  { label: 'My Tasks', icon: FiCheckSquare, href: '/employee/tasks' },
  { label: 'Attendance', icon: FiCalendar, href: '/employee/attendance' },
  { label: 'Leave Requests', icon: FiClock, href: '/employee/leaves' },
  { label: 'Salary Slips', icon: FiDollarSign, href: '/employee/salary-slips' },
  { label: 'EOD Updates', icon: FiClipboard, href: '/employee/eod' },
]

const clientNav: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, href: '/client/dashboard' },
  { label: 'My Services', icon: FiFolder, href: '/client/services' },
  { label: 'Notifications', icon: FiBell, href: '/client/notifications' },
]

export default function Sidebar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  let navItems: NavItem[] = []
  if (user?.role === 'admin') navItems = adminNav
  else if (user?.role === 'bda') navItems = employeeNav
  else if (user?.role === 'client') navItems = clientNav

  const isActive = (href: string) => router.pathname === href

  return (
    <Box
      as="nav"
      w="260px"
      minH="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.100"
      py={6}
      position="fixed"
      left={0}
      top={0}
      zIndex={10}
    >
      {/* Logo */}
      <Flex px={6} mb={8} align="center" justify="center">
        <Image src="/logo.png" alt="Startup Healer" h="60px" objectFit="contain" />
      </Flex>

      {/* Nav Items */}
      <VStack spacing={1} align="stretch" px={3}>
        {navItems.map((item) => (
          <Flex
            key={item.href}
            align="center"
            px={4}
            py={2.5}
            borderRadius="8px"
            cursor="pointer"
            bg={isActive(item.href) ? 'linear-gradient(135deg, rgba(95,175,70,0.1) 0%, rgba(46,158,142,0.1) 100%)' : 'transparent'}
            color={isActive(item.href) ? 'teal.600' : 'gray.600'}
            fontWeight={isActive(item.href) ? '600' : '500'}
            _hover={{
              bg: isActive(item.href) ? undefined : 'gray.50',
              color: 'teal.600',
            }}
            transition="all 0.15s"
            onClick={() => router.push(item.href)}
          >
            <Icon as={item.icon} mr={3} fontSize="lg" />
            <Text fontSize="sm">{item.label}</Text>
          </Flex>
        ))}
      </VStack>

      <Divider my={4} />

      {/* User info + Logout */}
      <VStack spacing={1} align="stretch" px={3}>
        <Box px={4} py={2}>
          <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" mb={1}>
            {user?.role === 'admin' ? 'Admin' : user?.role === 'bda' ? 'Employee' : 'Client'}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="navy.500" noOfLines={1}>
            {user?.name}
          </Text>
          <Text fontSize="xs" color="gray.400" noOfLines={1}>
            {user?.email}
          </Text>
        </Box>
        <Flex
          align="center"
          px={4}
          py={2.5}
          borderRadius="8px"
          cursor="pointer"
          color="red.500"
          _hover={{ bg: 'red.50' }}
          transition="all 0.15s"
          onClick={logout}
        >
          <Icon as={FiLogOut} mr={3} fontSize="lg" />
          <Text fontSize="sm" fontWeight="500">Logout</Text>
        </Flex>
      </VStack>
    </Box>
  )
}
