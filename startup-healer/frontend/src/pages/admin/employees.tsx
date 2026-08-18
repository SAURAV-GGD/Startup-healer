import { useState, useEffect } from 'react'
import {
  Box, Heading, Text, Flex, Button, Table, Thead, Tbody, Tr, Th, Td,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel, Input, Select, useToast, IconButton,
  Spinner, Alert, AlertIcon, FormErrorMessage, Badge,
} from '@chakra-ui/react'
import { FiPlus, FiEdit2, FiTrash2, FiBarChart2 } from 'react-icons/fi'
import Layout from '@/components/Layout'
import { apiClient } from '@/lib/api'

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'bda' })
  const [formErrors, setFormErrors] = useState<any>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchEmployees = async () => {
    try {
      setEmployees(await apiClient.getEmployees())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEmployees() }, [])

  const validate = () => {
    const errors: any = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (editingId) {
        await apiClient.updateEmployee(editingId, formData)
        toast({ title: 'Employee updated', status: 'success', duration: 2000 })
        handleClose()
      } else {
        const result = await apiClient.createEmployee(formData)
        setGeneratedPassword(result.generated_password)
        toast({ title: 'Employee created', status: 'success', duration: 2000 })
      }
      fetchEmployees()
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', status: 'error', duration: 3000 })
    }
  }

  const handleEdit = (emp: any) => {
    setFormData({ name: emp.name, email: emp.email, phone: emp.phone || '', role: emp.role })
    setEditingId(emp.id)
    setGeneratedPassword('')
    onOpen()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await apiClient.deleteEmployee(id)
      toast({ title: 'Employee removed', status: 'success', duration: 2000 })
      fetchEmployees()
    } catch (err) { toast({ title: 'Failed', status: 'error', duration: 3000 }) }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', role: 'bda' })
    setFormErrors({})
    setEditingId(null)
    setGeneratedPassword('')
    onClose()
  }

  return (
    <Layout requiredRole="admin">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="navy.500" mb={1}>Employees</Heading>
          <Text color="gray.500" fontSize="sm">{employees.length} team members</Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
          color="white" _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', role: 'bda' }); onOpen() }}
        >
          Add Employee
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : employees.length === 0 ? (
        <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px">
          <Text color="gray.400" mb={4}>No employees yet</Text>
          <Button size="sm" onClick={onOpen}>Add first employee</Button>
        </Flex>
      ) : (
        <Box bg="white" borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs" color="gray.500">Name</Th>
                <Th fontSize="xs" color="gray.500">Email</Th>
                <Th fontSize="xs" color="gray.500">Role</Th>
                <Th fontSize="xs" color="gray.500">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.map((emp) => (
                <Tr key={emp.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="600" fontSize="sm">{emp.name}</Td>
                  <Td fontSize="sm" color="gray.600">{emp.email}</Td>
                  <Td>
                    <Badge colorScheme={emp.role === 'admin' ? 'purple' : 'blue'} borderRadius="full" px={3} py={1}>
                      {emp.role === 'admin' ? 'Admin' : 'BDA'}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton aria-label="Edit" icon={<FiEdit2 />} size="sm" variant="ghost" color="gray.500" onClick={() => handleEdit(emp)} />
                      <IconButton aria-label="Delete" icon={<FiTrash2 />} size="sm" variant="ghost" color="red.400" onClick={() => handleDelete(emp.id)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader>{editingId ? 'Edit Employee' : 'Add New Employee'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {generatedPassword && (
              <Alert status="success" mb={4} borderRadius="10px">
                <AlertIcon />
                <Box>
                  <Text fontWeight="600">Employee created! Auto-generated password:</Text>
                  <Text fontFamily="mono" fontSize="lg" fontWeight="bold">{generatedPassword}</Text>
                  <Text fontSize="xs" color="gray.500">Share this with the employee.</Text>
                </Box>
              </Alert>
            )}
            <Flex direction="column" gap={4}>
              <FormControl isInvalid={!!formErrors.name}>
                <FormLabel fontSize="sm">Name</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.email}>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} borderRadius="10px" />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Phone</FormLabel>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} borderRadius="10px" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Role</FormLabel>
                <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} borderRadius="10px">
                  <option value="bda">BDA (Employee)</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)" color="white" _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }} onClick={handleSubmit}>
              {editingId ? 'Update' : 'Create Employee'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
