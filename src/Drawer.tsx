import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import React, { PropsWithChildren, useEffect, useState } from 'react'

type Props = PropsWithChildren<{
  title: string
  isOpen: boolean
  onCancel: VoidFunction
  isStacked?: boolean
}>

export const Drawer: React.FC<Props> = (props) => {
  const { isStacked } = props
  const [isOpen, setIsOpen] = useState(props.isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (props.isOpen) {
      setIsVisible(true)
      setIsOpen(true)
    } else {
      setIsOpen(false)
      setTimeout(() => setIsVisible(false), 0)
    }
  }, [props.isOpen])

  const drawerBody = clsx(
    // position
    'z-10 fixed top-0 right-0 transition-all',
    // size
    'flex flex-col h-dvh max-w-full',
    // border and background
    'border border-solid border-zinc-800 bg-card',
    isStacked ? 'w-full pr-3/5' : 'w-3/5',
    isVisible ? 'visible' : 'invisible',
    isOpen ? 'translate-x-0' : 'translate-x-full',
  )

  return (
    <div className={drawerBody}>
      {props.isOpen && props.children && (
        <>
          <div className="flex relative items-center p-4 border-b border-solid border-zinc-800">
            <div
              className="absolute left-2 p-1 fill-zinc-300 cursor-pointer bg-zinc-800 rounded-full hover:bg-zinc-700"
              onClick={props.onCancel}
            >
              <ChevronRight size={24} />
            </div>
            <div className="flex-1 text-center font-bold" aria-label="Title">
              {props.title}
            </div>
          </div>
          <div className="flex overflow-auto" aria-label="Body">
            {props.children}
          </div>
        </>
      )}
    </div>
  )
}
