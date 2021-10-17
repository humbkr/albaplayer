import React, { useRef } from 'react'
import styled, { withTheme } from 'styled-components'
import Modal from 'react-modal'
import { AppTheme } from '../../themes/types'

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#root')

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
  itemId: string
  handlePlayNow: (id: string) => void
  handleAddToQueue: (id: string) => void
  theme: AppTheme
}

function KeyboardNavPlayPopup({
  id,
  isOpen,
  onClose,
  itemId,
  handlePlayNow,
  handleAddToQueue,
  theme,
}: Props) {
  const modalRef = useRef(null)

  const afterOpenModal = () => {
    // @ts-ignore
    modalRef.current.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    e.preventDefault()
    if (e.keyCode === 13) {
      // If Enter adds element to the end of the playlist.
      handleAddToQueue(itemId)
    } else if (e.keyCode === 32) {
      // If Space plays the element directly.
      handlePlayNow(itemId)
    }
    // Else just close the popup and do nothing else.
    onClose()
  }

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      backgroundColor: theme.backgroundColor,
    },
    overlay: {
      backgroundColor: '',
    },
  }

  return (
    <Modal
      id={id}
      style={modalStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterOpen={afterOpenModal}
    >
      <ModalContent
        role="button"
        ref={modalRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div>
          Press <Action>Enter</Action> again to add to the current playlist
        </div>
        <div>
          Press <Action>Space</Action> to replace playlist with current
          selection
        </div>
      </ModalContent>
    </Modal>
  )
}

export default withTheme(KeyboardNavPlayPopup)

const ModalContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  color: ${(props) => props.theme.textPrimaryColor};
`
const Action = styled.div`
  display: inline-block;
  border: 1px solid ${(props) => props.theme.textPrimaryColor};
  border-radius: 3px;
  padding: 5px;
`
