import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const logMessageVariants = cva('flex-1 whitespace-nowrap font-bold text-base text-sm', {
  variants: {
    variant: {
      center: 'text-center',
      code: 'text-mono bg-zinc-900 rounded-sm px-2 py-1 grow-0',
    },
  },
  defaultVariants: {},
})

export interface LogMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logMessageVariants> {}

function LogMessage({ className, variant, ...props }: LogMessageProps) {
  return <div className={cn(logMessageVariants({ variant }), className)} {...props} />
}

export { LogMessage, logMessageVariants }
