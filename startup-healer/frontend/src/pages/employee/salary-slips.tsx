import { Box, Heading, Text, Flex } from '@chakra-ui/react'
import Layout from '@/components/Layout'

export default function EmployeeSalarySlips() {
  return (
    <Layout requiredRole="bda">
      <Box mb={6}><Heading size="lg" color="navy.500" mb={1}>Salary Slips</Heading><Text color="gray.500" fontSize="sm">View and download your salary slips</Text></Box>
      <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
        <Text color="gray.400">No salary slips available yet</Text>
      </Flex>
    </Layout>
  )
}
