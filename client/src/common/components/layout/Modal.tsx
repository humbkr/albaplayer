import styled, { useTheme } from 'styled-components'
import ReactModal from 'react-modal'
import { useTranslation } from 'react-i18next'
import ActionButton from 'common/components/buttons/ActionButton'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'

// http://reactcommunity.org/react-modal/accessibility/
ReactModal.setAppElement('#root')

type Props = {
  id: string
  title?: string
  isOpen: boolean
  onOpen?: () => void
  onClose?: () => void
  onValidate?: (content?: any) => void
  children?: React.ReactNode
  mainActionLabel?: string
  mainActionLoading?: boolean
  cancelActionLabel?: string
  hideCloseButton?: boolean
  hideActionsButtons?: boolean
}

function Modal({
  id,
  title,
  isOpen,
  onOpen,
  onClose,
  onValidate,
  children,
  mainActionLabel,
  mainActionLoading,
  cancelActionLabel,
  hideCloseButton = false,
  hideActionsButtons = false,
}: Props) {
  const { t } = useTranslation()
  const theme = useTheme()

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: `1px solid ${theme.colors.sidebarSeparator}`,
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      padding: '20px',
      backgroundColor: theme.colors.elementHighlight,
    },
    overlay: {
      backgroundColor: '',
    },
  }

  return (
    <ReactModal
      id={id}
      style={modalStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterOpen={onOpen}
    >
      <ModalContent>
        <Header hasTitle={!!title}>
          {title && (
            <>
              <Placeholder />
              <Title>{title}</Title>
            </>
          )}
          {!hideCloseButton && (
            <ActionButtonIcon onClick={onClose} icon="close" />
          )}
        </Header>
        {children}
      </ModalContent>
      {!hideActionsButtons && (
        <Actions>
          <ActionButton onClick={onClose}>
            {cancelActionLabel || t('common.cancel')}
          </ActionButton>
          <ActionButton raised onClick={onValidate} loading={mainActionLoading}>
            {mainActionLabel || t('common.validate')}
          </ActionButton>
        </Actions>
      )}
    </ReactModal>
  )
}

export default Modal

const ModalContent = styled.div`
  color: ${(props) => props.theme.colors.textPrimary};
`
const Header = styled.div<{ hasTitle: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.hasTitle ? 'space-between' : 'flex-end'};
  align-items: center;
  margin: -10px -10px ${(props) => (props.hasTitle ? '20px' : '5px')};
`
const Placeholder = styled.div`
  width: 44px;
  flex-shrink: 0;
`
const Title = styled.h4`
  width: 100%;
  text-align: center;
`
const Actions = styled.div`
  margin-top: 30px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
`
