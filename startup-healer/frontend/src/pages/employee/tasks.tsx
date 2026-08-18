import { useState, useEffect } from 'react'
import { Box, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.getMyTasks().then(setTasks).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <Layout requiredRole="bda">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Task History</Heading>
        <Text color="gray.500" fontSize="sm">All your assigned tasks</Text>
      </Box>
      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr><Th fontSize="xs">Title</Th><Th fontSize="xs">Due Date</Th><Th fontSize="xs">Priority</Th><Th fontSize="xs">Status</Th></Tr>
            </Thead>
            <Tbody>
              {tasks.map(t => (
                <Tr key={t.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontSize="sm" fontWeight="600">{t.title}</Td>
                  <Td fontSize="sm" color="gray.600">{new Date(t.due_date).toLocaleDateString()}</Td>
                  <Td><StatusBadge status={t.priority} /></Td>
                  <Td><StatusBadge status={t.status} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {tasks.length === 0 && <Flex justify="center" py={8}><Text color="gray.400">No tasks yet</Text></Flex>}
        </Box>
      )}
    </Layout>
  )
}
