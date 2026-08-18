import { useState, useEffect } from 'react'
import { Box, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function EmployeeAttendance() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.getMyAttendance().then(setRecords).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <Layout requiredRole="bda">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Attendance</Heading>
        <Text color="gray.500" fontSize="sm">Your attendance this month</Text>
      </Box>
      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr><Th fontSize="xs">Date</Th><Th fontSize="xs">Status</Th><Th fontSize="xs">Check In</Th><Th fontSize="xs">Check Out</Th></Tr>
            </Thead>
            <Tbody>
              {records.map(r => (
                <Tr key={r.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontSize="sm" fontWeight="600">{new Date(r.date).toLocaleDateString()}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td fontSize="sm" color="gray.600">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : '-'}</Td>
                  <Td fontSize="sm" color="gray.600">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : '-'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {records.length === 0 && <Flex justify="center" py={8}><Text color="gray.400">No attendance records</Text></Flex>}
        </Box>
      )}
    </Layout>
  )
}
