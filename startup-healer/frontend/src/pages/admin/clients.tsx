import { useState, useEffect, useCallback } from 'react'
import {
  Box, Heading, Text, Flex, Button, Input, Select, Table, Thead, Tbody, Tr, Th, Td,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel, FormErrorMessage, useToast, IconButton,
  InputGroup, InputLeftElement, Icon, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react'
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi'
import Layout from '@/components/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import { apiClient } from '@/lib/api'

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [formData, setFormData] = useState({ name: '', company_name: '', email: '', phone: '', assigned_employee_id: '' })
  const [formErrors, setFormErrors] = useState<any>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchClients = useCallback(async (options?: { ignore?: boolean }) => {
    if (options?.ignore) return
    try {
      const data = await apiClient.getClients(search || undefined, filterStatus || undefined)
      if (!options?.ignore) {
        setClients(data)
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    } finally {
      if (!options?.ignore) setLoading(false)
    }
  }, [search, filterStatus])

  const fetchEmployees = useCallback(async (options?: { ignore?: boolean }) => {
    if (options?.ignore) return
    try {
      const data = await apiClient.getEmployees()
      if (!options?.ignore) {
        setEmployees(data)
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    }
  }, [])

  useEffect(() => {
    const options = { ignore: false }
    fetchClients(options)
    fetchEmployees(options)
    return () => { options.ignore = true }
  }, [fetchClients, fetchEmployees])

  const validate = () => {
    const errors: any = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.company_name.trim()) errors.company_name = 'Company name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email'
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Must be 10 digits'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (editingId) {
        await apiClient.updateClient(editingId, formData)
        toast({ title: 'Client updated', status: 'success', duration: 2000 })
      } else {
        const result = await apiClient.createClient(formData)
        setGeneratedPassword(result.generated_password)
        toast({ title: 'Client created', status: 'success', duration: 2000 })
      }
      fetchClients()
      if (!editingId || !generatedPassword) {
        handleClose()
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', status: 'error', duration: 3000 })
    }
  }

  const handleEdit = (client: any) => {
    setFormData({
      name: client.name, company_name: client.company_name, email: client.email,
      phone: client.phone, assigned_employee_id: client.assigned_employee_id || '',
    })
    setEditingId(client.id)
    setGeneratedPassword('')
    onOpen()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await apiClient.deleteClient(id)
      toast({ title: 'Client deleted', status: 'success', duration: 2000 })
      fetchClients()
    } catch (err) {
      toast({ title: 'Delete failed', status: 'error', duration: 3000 })
    }
  }

  const handleClose = () => {
    setFormData({ name: '', company_name: '', email: '', phone: '', assigned_employee_id: '' })
    setFormErrors({})
    setEditingId(null)
    setGeneratedPassword('')
    onClose()
  }

  return (
    <Layout requiredRole="admin">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="navy.500" mb={1}>Clients</Heading>
          <Text color="gray.500" fontSize="sm">{clients.length} total clients</Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
          color="white"
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          onClick={() => { setEditingId(null); setFormData({ name: '', company_name: '', email: '', phone: '', assigned_employee_id: '' }); onOpen() }}
        >
          Add Client
        </Button>
      </Flex>

      {/* Search & Filter */}
      <Flex gap={4} mb={6}>
        <InputGroup maxW="320px">
          <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} borderRadius="10px" bg="white" />
        </InputGroup>
        <Select maxW="200px" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} borderRadius="10px" bg="white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="inactive">Inactive</option>
        </Select>
      </Flex>

      {/* Table */}
      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : clients.length === 0 ? (
        <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px">
          <Text color="gray.400" mb={4}>No clients found</Text>
          <Button size="sm" onClick={() => { setEditingId(null); onOpen() }}>Add your first client</Button>
        </Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs" color="gray.500">Name</Th>
                <Th fontSize="xs" color="gray.500">Company</Th>
                <Th fontSize="xs" color="gray.500">Email</Th>
                <Th fontSize="xs" color="gray.500">Phone</Th>
                <Th fontSize="xs" color="gray.500">Status</Th>
                <Th fontSize="xs" color="gray.500">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client) => (
                <Tr key={client.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                  <Td fontWeight="600" fontSize="sm">{client.name}</Td>
                  <Td fontSize="sm" color="gray.600">{client.company_name}</Td>
                  <Td fontSize="sm" color="gray.600">{client.email}</Td>
                  <Td fontSize="sm" color="gray.600">{client.phone}</Td>
                  <Td><StatusBadge status={client.status} /></Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton aria-label="Edit" icon={<FiEdit2 />} size="sm" variant="ghost" color="gray.500" onClick={() => handleEdit(client)} />
                      <IconButton aria-label="Delete" icon={<FiTrash2 />} size="sm" variant="ghost" color="red.400" onClick={() => handleDelete(client.id)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader>{editingId ? 'Edit Client' : 'Add New Client'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {generatedPassword && (
              <Alert status="success" mb={4} borderRadius="10px">
                <AlertIcon />
                <Box>
                  <Text fontWeight="600">Client created! Auto-generated password:</Text>
                  <Text fontFamily="mono" fontSize="lg" fontWeight="bold">{generatedPassword}</Text>
                  <Text fontSize="xs" color="gray.500">Share this with the client. It won't be shown again.</Text>
                </Box>
              </Alert>
            )}
            <Flex direction="column" gap={4}>
              <FormControl isInvalid={!!formErrors.name}>
                <FormLabel fontSize="sm">Name</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.company_name}>
                <FormLabel fontSize="sm">Company Name</FormLabel>
                <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.company_name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.email}>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.phone}>
                <FormLabel fontSize="sm">Phone (10 digits)</FormLabel>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.phone}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Assign Employee</FormLabel>
                <Select value={formData.assigned_employee_id} onChange={(e) => setFormData({ ...formData, assigned_employee_id: e.target.value })} borderRadius="10px">
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button
              bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
              color="white"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              onClick={handleSubmit}
            >
              {editingId ? 'Update' : 'Create Client'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
