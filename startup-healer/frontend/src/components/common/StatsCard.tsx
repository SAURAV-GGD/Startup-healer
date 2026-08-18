import { Box, Flex, Text, Icon } from '@chakra-ui/react'
import { IconType } from 'react-icons'

interface StatsCardProps {
  label: string
  value: string | number
  icon: IconType
  color?: string
  gradient?: boolean
}

export default function StatsCard({ label, value, icon, color = 'teal.500', gradient }: StatsCardProps) {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      p={5}
      boxShadow="0 1px 3px rgba(0,0,0,0.08)"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' }}
    >
      <Flex justify="space-between" align="start">
        <Box>
          <Text fontSize="sm" color="gray.500" fontWeight="500" mb={1}>
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="700" color="navy.500">
            {value}
          </Text>
        </Box>
        <Flex
          w="42px"
          h="42px"
          borderRadius="10px"
          align="center"
          justify="center"
          bg={gradient ? 'linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)' : `${color}`}
          opacity={gradient ? 1 : 0.15}
        >
          <Icon as={icon} fontSize="xl" color={gradient ? 'white' : color} />
        </Flex>
      </Flex>
    </Box>
  )
}
