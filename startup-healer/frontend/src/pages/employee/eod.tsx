import { useState, useEffect } from 'react'
import { Box, Heading, Text, Flex, Card, CardHeader, CardBody, Spinner } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import { apiClient } from '@/lib/api'

export default function EmployeeEod() {
  const [eods, setEods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { apiClient.getMyEods().then(setEods).catch(console.error).finally(() => setLoading(false)) }, [])

  return (
    <Layout requiredRole="bda">
      <Box mb={6}><Heading size="lg" color="navy.500" mb={1}>EOD Updates</Heading><Text color="gray.500" fontSize="sm">Your end-of-day submissions</Text></Box>
      {loading ? (
        <Flex justify="center" py={12}><Spinner size="xl" color="teal.500" /></Flex>
      ) : eods.length === 0 ? (
        <Flex direction="column" align="center" py={12} bg="white" borderRadius="12px"><Text color="gray.400">No EOD updates yet</Text></Flex>
      ) : (
        <Flex direction="column" gap={4}>
          {eods.map(eod => (
            <Card key={eod.id} borderRadius="12px">
              <CardHeader pb={1}>
                <Flex justify="space-between"><Text fontWeight="700" color="navy.500">{new Date(eod.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text></Flex>
              </CardHeader>
              <CardBody pt={0}>
                <Text fontSize="sm" color="gray.600" mb={2}>{eod.summary}</Text>
                {eod.blockers && <Text fontSize="sm" color="red.500">Blockers: {eod.blockers}</Text>}
              </CardBody>
            </Card>
          ))}
        </Flex>
      )}
    </Layout>
  )
}
