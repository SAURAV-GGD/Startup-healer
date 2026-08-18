import { useState, useEffect } from 'react'
import { Box, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function AdminAttendance() {
  const [summary, setSummary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.getAttendanceSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout requiredRole="admin">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Attendance</Heading>
        <Text color="gray.500" fontSize="sm">Team attendance overview for this month</Text>
      </Box>

      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs">Employee</Th>
                <Th fontSize="xs">Email</Th>
                <Th fontSize="xs" isNumeric>Present</Th>
                <Th fontSize="xs" isNumeric>Absent</Th>
                <Th fontSize="xs" isNumeric>On Leave</Th>
                <Th fontSize="xs" isNumeric>Total Days</Th>
              </Tr>
            </Thead>
            <Tbody>
              {summary.map((row) => (
                <Tr key={row.employee.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="600" fontSize="sm">{row.employee.name}</Td>
                  <Td fontSize="sm" color="gray.600">{row.employee.email}</Td>
                  <Td isNumeric fontSize="sm" color="green.600" fontWeight="600">{row.present}</Td>
                  <Td isNumeric fontSize="sm" color="red.500" fontWeight="600">{row.absent}</Td>
                  <Td isNumeric fontSize="sm" color="orange.500" fontWeight="600">{row.on_leave}</Td>
                  <Td isNumeric fontSize="sm" fontWeight="600">{row.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {summary.length === 0 && (
            <Flex justify="center" py={8}><Text color="gray.400">No attendance records</Text></Flex>
          )}
        </Box>
      )}
    </Layout>
  )
}
