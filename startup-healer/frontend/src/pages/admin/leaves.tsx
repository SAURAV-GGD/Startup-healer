import { useState, useEffect } from 'react'
import { Box, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Spinner } from '@chakra-ui/react'
import { FiCheck, FiX } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchLeaves = async () => {
    try { setLeaves(await apiClient.getAllLeaves()) } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchLeaves() }, [])

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.updateLeaveStatus(id, { status })
      toast({ title: `Leave ${status}`, status: status === 'approved' ? 'success' : 'info', duration: 2000 })
      fetchLeaves()
    } catch (err) { toast({ title: 'Failed', status: 'error', duration: 3000 }) }
  }

  return (
    <Layout requiredRole="admin">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Leave Requests</Heading>
        <Text color="gray.500" fontSize="sm">Review and manage employee leave requests</Text>
      </Box>

      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs">Type</Th>
                <Th fontSize="xs">From</Th>
                <Th fontSize="xs">To</Th>
                <Th fontSize="xs">Reason</Th>
                <Th fontSize="xs">Status</Th>
                <Th fontSize="xs">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaves.map((leave) => (
                <Tr key={leave.id} _hover={{ bg: 'gray.50' }}>
                  <Td><StatusBadge status={leave.leave_type} /></Td>
                  <Td fontSize="sm">{new Date(leave.from_date).toLocaleDateString()}</Td>
                  <Td fontSize="sm">{new Date(leave.to_date).toLocaleDateString()}</Td>
                  <Td fontSize="sm" color="gray.600" maxW="200px" isTruncated>{leave.reason}</Td>
                  <Td><StatusBadge status={leave.status} /></Td>
                  <Td>
                    {leave.status === 'pending' && (
                      <Flex gap={2}>
                        <Button size="xs" colorScheme="green" leftIcon={<FiCheck />} onClick={() => handleAction(leave.id, 'approved')}>Approve</Button>
                        <Button size="xs" colorScheme="red" leftIcon={<FiX />} onClick={() => handleAction(leave.id, 'rejected')}>Reject</Button>
                      </Flex>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {leaves.length === 0 && (
            <Flex justify="center" py={8}><Text color="gray.400">No leave requests</Text></Flex>
          )}
        </Box>
      )}
    </Layout>
  )
}
