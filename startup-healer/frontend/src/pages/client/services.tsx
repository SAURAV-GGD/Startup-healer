import { Box, Heading, Text, Flex } from '@chakra-ui/react'
import Layout from '@/components/Layout'

export default function ClientServices() {
  return (
    <Layout requiredRole="client">
      <Box mb={6}><Heading size="lg" color="navy.500" mb={1}>My Services</Heading><Text color="gray.500" fontSize="sm">Manage your service applications and documents</Text></Box>
      <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px" boxShadow="0 1px 3px rgba(0,0,0,0.08)">
        <Text color="gray.400">Service details and document upload coming soon</Text>
      </Flex>
    </Layout>
  )
}
