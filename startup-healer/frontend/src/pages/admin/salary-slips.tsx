import { Box, Heading, Text, Flex } from '@chakra-ui/react'
import Layout from '@/components/Layout'

export default function AdminSalarySlips() {
  return (
    <Layout requiredRole="admin">
      <Box mb={6}>
        <Heading size="lg" color="navy.500" mb={1}>Salary Slips</Heading>
        <Text color="gray.500" fontSize="sm">Upload and manage employee salary slips</Text>
      </Box>
      <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
        <Text color="gray.400">Salary slip management — upload via Supabase Storage</Text>
      </Flex>
    </Layout>
  )
}
