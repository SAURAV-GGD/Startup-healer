import { useState, useEffect } from 'react'
import {
  Box, Heading, Text, Flex, Button, Table, Thead, Tbody, Tr, Th, Td,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea, useToast, Spinner,
} from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function EmployeeLeaves() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ leave_type: 'casual', from_date: '', to_date: '', reason: '' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => { apiClient.getMyLeaves().then(setLeaves).catch(console.error).finally(() => setLoading(false)) }, [])

  const handleSubmit = async () => {
    if (!formData.from_date || !formData.to_date || !formData.reason.trim()) {
      toast({ title: 'Fill all fields', status: 'warning', duration: 2000 }); return
    }
    try {
      await apiClient.createLeaveRequest(formData)
      toast({ title: 'Leave request submitted', status: 'success', duration: 2000 })
      setLeaves(await apiClient.getMyLeaves())
      onClose()
      setFormData({ leave_type: 'casual', from_date: '', to_date: '', reason: '' })
    } catch (err) { toast({ title: 'Failed', status: 'error', duration: 3000 }) }
  }

  return (
    <Layout requiredRole="bda">
      <Flex justify="space-between" align="center" mb={6}>
        <Box><Heading size="lg" color="navy.500" mb={1}>Leave Requests</Heading><Text color="gray.500" fontSize="sm">Your leave history</Text></Box>
        <Button leftIcon={<FiPlus />} bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }} onClick={onOpen}>
          Request Leave
        </Button>
      </Flex>
      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50"><Tr><Th fontSize="xs">Type</Th><Th fontSize="xs">From</Th><Th fontSize="xs">To</Th><Th fontSize="xs">Reason</Th><Th fontSize="xs">Status</Th></Tr></Thead>
            <Tbody>
              {leaves.map(l => (
                <Tr key={l.id} _hover={{ bg: 'gray.50' }}>
                  <Td><StatusBadge status={l.leave_type} /></Td>
                  <Td fontSize="sm">{new Date(l.from_date).toLocaleDateString()}</Td>
                  <Td fontSize="sm">{new Date(l.to_date).toLocaleDateString()}</Td>
                  <Td fontSize="sm" color="gray.600" maxW="200px" isTruncated>{l.reason}</Td>
                  <Td><StatusBadge status={l.status} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {leaves.length === 0 && <Flex justify="center" py={8}><Text color="gray.400">No leave requests</Text></Flex>}
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay /><ModalContent borderRadius="16px">
          <ModalHeader>Request Leave</ModalHeader><ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl><FormLabel fontSize="sm">Leave Type</FormLabel>
                <Select value={formData.leave_type} onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })} borderRadius="10px">
                  <option value="casual">Casual</option><option value="sick">Sick</option><option value="paid">Paid</option>
                </Select>
              </FormControl>
              <Flex gap={4}>
                <FormControl><FormLabel fontSize="sm">From Date</FormLabel><Input type="date" value={formData.from_date} onChange={(e) => setFormData({ ...formData, from_date: e.target.value })} borderRadius="10px" /></FormControl>
                <FormControl><FormLabel fontSize="sm">To Date</FormLabel><Input type="date" value={formData.to_date} onChange={(e) => setFormData({ ...formData, to_date: e.target.value })} borderRadius="10px" /></FormControl>
              </Flex>
              <FormControl><FormLabel fontSize="sm">Reason</FormLabel><Textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} borderRadius="10px" /></FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}><Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" onClick={handleSubmit}>Submit Request</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
