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

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ employee_id: '', client_id: '', title: '', description: '', due_date: '', priority: 'medium' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    Promise.all([apiClient.getTasks(), apiClient.getEmployees(), apiClient.getClients()])
      .then(([t, e, c]) => { setTasks(t); setEmployees(e); setClients(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!formData.employee_id || !formData.title || !formData.due_date) {
      toast({ title: 'Fill required fields', status: 'warning', duration: 2000 }); return
    }
    try {
      await apiClient.createTask(formData)
      toast({ title: 'Task assigned', status: 'success', duration: 2000 })
      const t = await apiClient.getTasks(); setTasks(t)
      onClose()
      setFormData({ employee_id: '', client_id: '', title: '', description: '', due_date: '', priority: 'medium' })
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', status: 'error', duration: 3000 })
    }
  }

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || '-'
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || '-'

  return (
    <Layout requiredRole="admin">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="navy.500" mb={1}>Tasks</Heading>
          <Text color="gray.500" fontSize="sm">Assign and track employee tasks</Text>
        </Box>
        <Button leftIcon={<FiPlus />} bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }} onClick={onOpen}>
          Assign Task
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs">Title</Th>
                <Th fontSize="xs">Assigned To</Th>
                <Th fontSize="xs">Client</Th>
                <Th fontSize="xs">Due Date</Th>
                <Th fontSize="xs">Priority</Th>
                <Th fontSize="xs">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="600" fontSize="sm">{task.title}</Td>
                  <Td fontSize="sm" color="gray.600">{getEmployeeName(task.employee_id)}</Td>
                  <Td fontSize="sm" color="gray.600">{task.client_id ? getClientName(task.client_id) : '-'}</Td>
                  <Td fontSize="sm" color="gray.600">{new Date(task.due_date).toLocaleDateString()}</Td>
                  <Td><StatusBadge status={task.priority} /></Td>
                  <Td><StatusBadge status={task.status} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader>Assign New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Title</FormLabel>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} borderRadius="10px" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Description</FormLabel>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} borderRadius="10px" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Assign To</FormLabel>
                <Select value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} borderRadius="10px">
                  <option value="">Select Employee</option>
                  {employees.filter(e => e.role === 'bda').map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Related Client</FormLabel>
                <Select value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} borderRadius="10px">
                  <option value="">None</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.company_name}</option>)}
                </Select>
              </FormControl>
              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Due Date</FormLabel>
                  <Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} borderRadius="10px" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Priority</FormLabel>
                  <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} borderRadius="10px">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" onClick={handleSubmit}>Assign Task</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
