import { useState, useEffect } from 'react'
import {
  Box, Heading, Text, Flex, Card, CardHeader, CardBody, Spinner,
  Table, Thead, Tbody, Tr, Th, Td, Grid,
} from '@chakra-ui/react'
import { FiFolder, FiClock, FiCheckCircle } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatsCard from '@/components/common/StatsCard'
import StatusBadge from '@/components/common/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiClient.getMyProfile(), apiClient.getMyServices()])
      .then(([p, s]) => { setProfile(p); setServices(s) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Layout requiredRole="client"><Flex minH="50vh" align="center" justify="center"><Spinner size="xl" color="teal.500" /></Flex></Layout>
  }

  const pendingServices = services.filter(s => ['pending', 'under_review', 'in_progress'].includes(s.status)).length
  const completedServices = services.filter(s => ['approved', 'completed'].includes(s.status)).length

  return (
    <Layout requiredRole="client">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Welcome, {profile?.name}</Heading>
        <Text color="gray.500" fontSize="sm">{profile?.company_name}</Text>
      </Box>

      {/* Profile Card */}
      <Card borderRadius="12px" mb={6}>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <Box><Text fontSize="xs" color="gray.400" fontWeight="600">NAME</Text><Text fontSize="sm" fontWeight="600">{profile?.name}</Text></Box>
            <Box><Text fontSize="xs" color="gray.400" fontWeight="600">COMPANY</Text><Text fontSize="sm" fontWeight="600">{profile?.company_name}</Text></Box>
            <Box><Text fontSize="xs" color="gray.400" fontWeight="600">EMAIL</Text><Text fontSize="sm">{profile?.email}</Text></Box>
            <Box><Text fontSize="xs" color="gray.400" fontWeight="600">PHONE</Text><Text fontSize="sm">{profile?.phone}</Text></Box>
          </Grid>
        </CardBody>
      </Card>

      {/* Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5} mb={8}>
        <StatsCard label="Total Services" value={services.length} icon={FiFolder} gradient />
        <StatsCard label="In Progress" value={pendingServices} icon={FiClock} color="orange.500" />
        <StatsCard label="Completed" value={completedServices} icon={FiCheckCircle} color="green.500" />
      </Grid>

      {/* Services Table */}
      <Card borderRadius="12px">
        <CardHeader pb={2}><Heading size="sm" color="navy.500">My Service Applications</Heading></CardHeader>
        <CardBody pt={0}>
          {services.length === 0 ? (
            <Text color="gray.400" fontSize="sm" py={4}>No service applications yet</Text>
          ) : (
            <Table>
              <Thead bg="gray.50">
                <Tr><Th fontSize="xs">Service</Th><Th fontSize="xs">Status</Th><Th fontSize="xs">Date Applied</Th><Th fontSize="xs">Last Updated</Th><Th fontSize="xs">Remark</Th></Tr>
              </Thead>
              <Tbody>
                {services.map(s => (
                  <Tr key={s.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontSize="sm" fontWeight="600">{s.service_name}</Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td fontSize="sm" color="gray.600">{new Date(s.date_applied).toLocaleDateString()}</Td>
                    <Td fontSize="sm" color="gray.600">{new Date(s.last_updated).toLocaleDateString()}</Td>
                    <Td fontSize="sm" color="gray.500" maxW="200px" isTruncated>{s.admin_remark || '-'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Layout>
  )
}
