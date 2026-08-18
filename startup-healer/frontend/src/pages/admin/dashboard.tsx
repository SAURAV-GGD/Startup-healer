import { useEffect, useState } from 'react'
import { Box, Grid, Heading, Text, Flex, Spinner } from '@chakra-ui/react'
import { FiBriefcase, FiUsers, FiCheckSquare, FiAlertTriangle, FiClock, FiUserCheck } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatsCard from '@/components/common/StatsCard'
import { apiClient } from '@/lib/api'

interface DashboardStats {
  totalClients: number
  activeClients: number
  pendingClients: number
  completedClients: number
  totalEmployees: number
  tasksDueToday: number
  tasksOverdue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientStats, employeeCount, tasksDue, tasksOverdue] = await Promise.all([
          apiClient.getClientStats(),
          apiClient.getEmployeeCount(),
          apiClient.getTasksDueToday(),
          apiClient.getOverdueTasks(),
        ])
        setStats({
          totalClients: clientStats.total,
          activeClients: clientStats.active,
          pendingClients: clientStats.pending,
          completedClients: clientStats.completed,
          totalEmployees: employeeCount,
          tasksDueToday: tasksDue,
          tasksOverdue: tasksOverdue,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Layout requiredRole="admin">
        <Flex minH="50vh" align="center" justify="center">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout requiredRole="admin">
      <Box mb={8}>
        <Heading size="lg" color="navy.500" mb={1}>Dashboard</Heading>
        <Text color="gray.500" fontSize="sm">Overview of your business operations</Text>
      </Box>

      {/* Stats Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={5} mb={8}>
        <StatsCard label="Total Clients" value={stats?.totalClients || 0} icon={FiBriefcase} gradient />
        <StatsCard label="Active Clients" value={stats?.activeClients || 0} icon={FiUserCheck} color="green.500" />
        <StatsCard label="Pending Clients" value={stats?.pendingClients || 0} icon={FiClock} color="orange.500" />
        <StatsCard label="Completed Clients" value={stats?.completedClients || 0} icon={FiBriefcase} color="blue.500" />
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5}>
        <StatsCard label="Total Employees" value={stats?.totalEmployees || 0} icon={FiUsers} color="purple.500" />
        <StatsCard label="Tasks Due Today" value={stats?.tasksDueToday || 0} icon={FiCheckSquare} color="teal.500" />
        <StatsCard label="Tasks Overdue" value={stats?.tasksOverdue || 0} icon={FiAlertTriangle} color="red.500" />
      </Grid>
    </Layout>
  )
}
