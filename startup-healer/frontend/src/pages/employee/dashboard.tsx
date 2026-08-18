import { useState, useEffect } from 'react'
import {
  Box, Grid, Heading, Text, Flex, Button, Spinner, Progress,
  Card, CardHeader, CardBody, Textarea, useToast, Select,
} from '@chakra-ui/react'
import { FiCheckSquare, FiTarget, FiUsers, FiClock } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatsCard from '@/components/common/StatsCard'
import StatusBadge from '@/components/common/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [todayTasks, setTodayTasks] = useState<any[]>([])
  const [targets, setTargets] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any>(null)
  const [eodSummary, setEodSummary] = useState('')
  const [eodBlockers, setEodBlockers] = useState('')
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const [tasks, tgts, cls, att] = await Promise.all([
          apiClient.getMyTodayTasks(),
          apiClient.getMyTargets(),
          apiClient.getAssignedClients(),
          apiClient.getTodayAttendance(),
        ])
        setTodayTasks(tasks)
        setTargets(tgts)
        setClients(cls)
        setAttendance(att)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleCheckIn = async () => {
    try {
      const result = await apiClient.checkIn()
      setAttendance(result)
      toast({ title: 'Checked in!', status: 'success', duration: 2000 })
    } catch (err: any) {
      toast({ title: err.response?.data?.message || 'Failed', status: 'error', duration: 3000 })
    }
  }

  const handleCheckOut = async () => {
    try {
      const result = await apiClient.checkOut()
      setAttendance(result)
      toast({ title: 'Checked out!', status: 'success', duration: 2000 })
    } catch (err: any) {
      toast({ title: 'Failed', status: 'error', duration: 3000 })
    }
  }

  const handleTaskStatus = async (taskId: string, status: string) => {
    try {
      await apiClient.updateTaskStatus(taskId, status)
      const tasks = await apiClient.getMyTodayTasks()
      setTodayTasks(tasks)
    } catch (err) { toast({ title: 'Failed', status: 'error', duration: 3000 }) }
  }

  const handleEodSubmit = async () => {
    if (!eodSummary.trim()) { toast({ title: 'Summary is required', status: 'warning', duration: 2000 }); return }
    try {
      const taskStatuses = todayTasks.map(t => ({ task_id: t.id, title: t.title, status: t.status }))
      await apiClient.submitEod({ summary: eodSummary, blockers: eodBlockers, task_statuses: taskStatuses })
      toast({ title: 'EOD submitted!', status: 'success', duration: 2000 })
      setEodSummary('')
      setEodBlockers('')
    } catch (err) { toast({ title: 'Failed', status: 'error', duration: 3000 }) }
  }

  if (loading) {
    return <Layout requiredRole="bda"><Flex minH="50vh" align="center" justify="center"><Spinner size="xl" color="teal.500" /></Flex></Layout>
  }

  return (
    <Layout requiredRole="bda">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="navy.500" mb={1}>Welcome, {user?.name}</Heading>
          <Text suppressHydrationWarning color="gray.500" fontSize="sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </Box>
        <Flex gap={3}>
          {!attendance?.check_in ? (
            <Button colorScheme="green" size="sm" onClick={handleCheckIn}>Check In</Button>
          ) : !attendance?.check_out ? (
            <Button colorScheme="orange" size="sm" onClick={handleCheckOut}>Check Out</Button>
          ) : (
            <Text fontSize="sm" color="green.500" fontWeight="600">✓ Checked in & out</Text>
          )}
        </Flex>
      </Flex>

      {/* Quick Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5} mb={8}>
        <StatsCard label="Today's Tasks" value={todayTasks.length} icon={FiCheckSquare} gradient />
        <StatsCard label="Assigned Clients" value={clients.length} icon={FiUsers} color="blue.500" />
        <StatsCard label="Active Targets" value={targets.length} icon={FiTarget} color="purple.500" />
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Today's Tasks */}
        <Card borderRadius="12px">
          <CardHeader pb={2}>
            <Heading size="sm" color="navy.500">Today's Tasks</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {todayTasks.length === 0 ? (
              <Text color="gray.400" fontSize="sm" py={4}>No tasks for today</Text>
            ) : (
              <Flex direction="column" gap={3}>
                {todayTasks.map(task => (
                  <Flex key={task.id} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="8px">
                    <Box>
                      <Text fontSize="sm" fontWeight="600">{task.title}</Text>
                      {task.description && <Text fontSize="xs" color="gray.500">{task.description}</Text>}
                    </Box>
                    <Select
                      size="xs" w="130px" value={task.status}
                      onChange={(e) => handleTaskStatus(task.id, e.target.value)}
                      borderRadius="6px"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </Select>
                  </Flex>
                ))}
              </Flex>
            )}
          </CardBody>
        </Card>

        {/* Targets */}
        <Card borderRadius="12px">
          <CardHeader pb={2}>
            <Heading size="sm" color="navy.500">My Targets</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {targets.length === 0 ? (
              <Text color="gray.400" fontSize="sm" py={4}>No targets set</Text>
            ) : (
              <Flex direction="column" gap={4}>
                {targets.map(target => {
                  const pct = target.target_value > 0 ? Math.round((target.achieved_value / target.target_value) * 100) : 0
                  return (
                    <Box key={target.id}>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="600">{target.description}</Text>
                        <Text fontSize="xs" color="gray.500">{target.achieved_value}/{target.target_value}</Text>
                      </Flex>
                      <Progress value={pct} size="sm" borderRadius="full" colorScheme={pct >= 100 ? 'green' : pct >= 50 ? 'blue' : 'orange'} />
                      <Text fontSize="xs" color="gray.400" mt={1}>{target.period}</Text>
                    </Box>
                  )
                })}
              </Flex>
            )}
          </CardBody>
        </Card>
      </Grid>

      {/* EOD Update */}
      <Card borderRadius="12px" mt={6}>
        <CardHeader pb={2}>
          <Heading size="sm" color="navy.500">End of Day Update</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <Flex direction="column" gap={3}>
            <Textarea placeholder="What did you accomplish today?" value={eodSummary} onChange={(e) => setEodSummary(e.target.value)} borderRadius="10px" />
            <Textarea placeholder="Any blockers or issues? (optional)" value={eodBlockers} onChange={(e) => setEodBlockers(e.target.value)} borderRadius="10px" rows={2} />
            <Button alignSelf="flex-end" bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }} onClick={handleEodSubmit}>
              Submit EOD
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Layout>
  )
}
