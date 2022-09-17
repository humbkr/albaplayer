import React, { useRef } from 'react'
import styled, { withTheme } from 'styled-components'
import Modal from 'react-modal'
import { useTranslation } from 'react-i18next'

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#root')

type Props = {
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
  const { t } = useTranslation()
  const modalRef = useRef(null)

  const afterOpenModal = () => {
    // @ts-ignore
    modalRef.current.focus()
  }

  const handleKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault()
    if (e.code === 'Enter') {
      // If Enter adds element to the end of the playlist.
      handleAddToQueue(itemId)
    } else if (e.code === 'Space') {
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
        // @ts-ignore
        onKeyDown={handleKeyDown}
      >
        <div>
          {t('common.press')} <Action>{t('common.enter')}</Action>{' '}
          {t('browser.actions.pressToAddToPlaylist')}
        </div>
        <div>
          {t('common.press')} <Action>{t('common.space')}</Action>{' '}
          {t('browser.actions.pressToReplacePlaylist')}
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
