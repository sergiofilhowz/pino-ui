import React, { PropsWithChildren, useEffect, useState } from 'react'
import styled from 'styled-components'
import { textStyles } from './styles/fontStyles'
import { colors } from './styles/colors'
import { ChevronRightIcon } from './ChevronRight'

type Props = PropsWithChildren<{
  ariaLabel?: string
  alwaysVisible?: boolean
  title: string
  isOpen: boolean
  onCancel: VoidFunction
  headerContent?: React.ReactNode
  moveLeft?: boolean
}>

export const Drawer: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(props.isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (props.alwaysVisible) {
      setIsOpen(props.isOpen)
      setIsVisible(true)
    } else if (props.isOpen) {
      setIsVisible(true)
      setIsOpen(true)
    } else {
      setIsOpen(false)
      setTimeout(() => setIsVisible(false), 0)
    }
  }, [props.alwaysVisible, props.isOpen])

  return (
    <Container
      aria-label={props.ariaLabel}
      $isOpen={isOpen}
      $isVisible={isVisible}
      $alwaysVisible={!!props.alwaysVisible}
      $moveLeft={props.moveLeft}
    >
      {props.isOpen && props.children && (
        <>
          <DrawerHeader>
            <DrawerHeaderButton onClick={props.onCancel}>
              <ChevronRightIcon size={24} />
            </DrawerHeaderButton>
            <DrawerTitle aria-label="Title">{props.title}</DrawerTitle>
            {props.headerContent && <DrawerHeaderContent>{props.headerContent}</DrawerHeaderContent>}
          </DrawerHeader>
          <DrawerBody aria-label="Body">{props.children}</DrawerBody>
        </>
      )}
    </Container>
  )
}

const Container = styled.div<{
  $isOpen: boolean
  $isVisible: boolean
  $alwaysVisible: boolean
  $moveLeft?: boolean
}>`
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: ${({ $moveLeft }) => ($moveLeft ? '100%' : '60%')};
  padding-right: ${({ $moveLeft }) => ($moveLeft ? '60%' : '0')};
  max-width: 100%;
  height: 100dvh;
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  background: ${colors.background.inactive};
  border: 1px solid ${colors.background.active};
  transition: all ease 0.3s;
  transform: ${({ $alwaysVisible }) => ($alwaysVisible ? 'translateX(100%)' : 'translateX(110%)')};
  ${({ $isOpen }) => $isOpen && 'transform: translateX(0%);'}
`

const DrawerBody = styled.div`
  flex: 1;
  overflow: auto;
  max-width: 100%;
`

const DrawerHeaderButton = styled.div`
  ${textStyles.body.sm}
  position: absolute;
  left: 16px;
  cursor: pointer;
  fill: white;
  background: ${colors.button.inactiveBg};
  padding: 4px;
  border-radius: 999px;

  &:hover {
    background: ${colors.button.hoverBg};
  }
  &:active {
    background: ${colors.button.activeBg};
  }
`

const DrawerHeader = styled.div`
  ${textStyles.label.sm}
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${colors.button.inactiveBg};
`

const DrawerTitle = styled.div`
  flex: 1;
  text-align: center;
`

const DrawerHeaderContent = styled.div`
  display: flex;
  position: absolute;
  right: 16px;
`
