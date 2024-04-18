import Modal from 'common/components/layout/Modal'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import styled from 'styled-components'

type Props = {
  id: string
  itemId: string
  handlePlayNow: (itemId: string) => void
  handleAddToQueue: (itemId: string) => void
  isOpen: boolean
  onClose: () => void
}

function KeyboardNavPlayModal({
  id,
  itemId,
  handlePlayNow,
  handleAddToQueue,
  isOpen,
  onClose,
}: Props) {
  const { t } = useTranslation()

  const contentRef = useRef<HTMLDivElement>(null)

  const afterOpenModal = () => {
    contentRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      onOpen={afterOpenModal}
      hideCloseButton
      hideActionsButtons
    >
      <Content
        role="button"
        ref={contentRef}
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
      </Content>
    </Modal>
  )
}

export default KeyboardNavPlayModal

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`
const Action = styled.div`
  display: inline-block;
  border: 1px solid ${(props) => props.theme.colors.textPrimary};
  border-radius: 3px;
  padding: 5px;
`
