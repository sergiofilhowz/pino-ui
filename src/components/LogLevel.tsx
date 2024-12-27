import React from 'react'
import { Badge, BadgeProps } from './ui/badge'

export const LogLevel: React.FC<{ level: string }> = ({ level }) => {
  const variant: Record<string, BadgeProps['variant']> = {
    FATAL: 'error',
    ERROR: 'error',
    WARN: 'warning',
    INFO: 'info',
    DEBUG: 'info',
    TRACE: 'info',
  }

  return <Badge variant={variant[level] ?? 'default'}>{level}</Badge>
}
