import React from 'react'
import { Badge, BadgeProps } from './ui/badge'

export const LogLevel: React.FC<{ level: string }> = ({ level }) => {
  const variant: Record<string, BadgeProps['variant']> = {
    ERROR: 'error',
    WARN: 'warning',
    INFO: 'info',
  }

  return <Badge variant={variant[level] ?? 'default'}>{level}</Badge>
}
