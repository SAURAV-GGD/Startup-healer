import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  // General
  active: { color: 'green', label: 'Active' },
  inactive: { color: 'gray', label: 'Inactive' },

  // Client status
  pending: { color: 'yellow', label: 'Pending' },
  completed: { color: 'green', label: 'Completed' },

  // Service application status
  under_review: { color: 'orange', label: 'Under Review' },
  in_progress: { color: 'blue', label: 'In Progress' },
  approved: { color: 'green', label: 'Approved' },
  rejected: { color: 'red', label: 'Rejected' },

  // Task status
  not_started: { color: 'gray', label: 'Not Started' },
  blocked: { color: 'red', label: 'Blocked' },

  // Leave status
  sick: { color: 'red', label: 'Sick' },
  casual: { color: 'blue', label: 'Casual' },
  paid: { color: 'purple', label: 'Paid' },

  // Attendance
  present: { color: 'green', label: 'Present' },
  absent: { color: 'red', label: 'Absent' },
  on_leave: { color: 'orange', label: 'On Leave' },
  holiday: { color: 'purple', label: 'Holiday' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'gray', label: status }

  return (
    <Badge
      colorScheme={config.color}
      borderRadius="full"
      px={3}
      py={1}
      fontSize="xs"
      fontWeight="600"
      textTransform="capitalize"
    >
      {config.label}
    </Badge>
  )
}
