import { useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import Modal from 'react-modal'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import dayjs from 'dayjs'
import { getRandomInt } from 'common/utils/utils'
import ActionButton from 'common/components/buttons/ActionButton'
import { useTranslation } from 'react-i18next'

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#root')

type Props = {
  id: string
  isOpen: boolean
  mode: string
  playlist?: Playlist
  onClose: () => void
  onCreatePlaylist: (playlist: Playlist) => void
  onEditPlaylist: (playlist: Playlist) => void
}

function PlaylistAddPopup({
  id,
  isOpen,
  onClose,
  mode = 'add',
  playlist,
  onCreatePlaylist,
  onEditPlaylist,
}: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const titleField = useRef<HTMLInputElement>(null)

  const afterOpenModal = () => {
    // @ts-ignore
    titleField.current.focus()
  }

  const handleCreatePlaylist = (title: string) => {
    onCreatePlaylist({
      id: `temp_${getRandomInt(1, 100000)}`,
      title,
      date: dayjs().format('YYYY-MM-DD'),
      items: [],
    })
  }

  const handleEditPlaylist = (title: string) => {
    // @ts-ignore
    onEditPlaylist({
      ...playlist,
      title,
    })
  }

  // Prevents weird bug when user is pressing enter to validate the form:
  // without this the modal doesn't close even if state is correct.
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault()
    }
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
      padding: '20px',
      width: '350px',
      backgroundColor: theme.colors.background,
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
        // @ts-ignore
        onKeyDown={(e) => handleKeyDown(e)}
        tabIndex={0}
      >
        <Title>
          {mode === 'edit' && t('playlists.actions.editPlaylist')}
          {mode !== 'edit' && t('playlists.actions.createANewPlaylist')}
        </Title>
        <Formik
          initialValues={{
            title: mode === 'edit' && playlist ? playlist.title : '',
          }}
          validate={(values) => {
            const errors: FormikErrors<any> = {}

            if (!values.title) {
              errors.title = t('common.forms.requiredField')
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            if (mode === 'edit') {
              handleEditPlaylist(values.title)
            } else {
              handleCreatePlaylist(values.title)
            }
            setSubmitting(false)
            onClose()
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form>
              <Label htmlFor="title">{t('common.title')}: </Label>
              <FormField
                autoComplete="off"
                type="text"
                name="title"
                innerRef={titleField}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.code === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
              <FormError name="title" component="span" />
              <Actions>
                <ActionButton
                  raised
                  // @ts-ignore
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {mode === 'edit' && t('common.edit')}
                  {mode !== 'edit' && t('common.create')}
                </ActionButton>
                <ActionButton onClick={onClose}>
                  {t('common.cancel')}
                </ActionButton>
              </Actions>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default PlaylistAddPopup

const ModalContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  color: ${(props) => props.theme.colors.textPrimary};
`
const Title = styled.h3`
  margin-bottom: 20px;
`
const Label = styled.label`
  display: block;
  color: ${(props) => props.theme.colors.textSecondary};
`
const FormField = styled(Field)`
  font-size: 1em;
  padding: 5px 10px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.inputBackground};
`
const FormError = styled(ErrorMessage)`
  color: ${(props) => props.theme.colors.error};
  font-size: 0.9em;
`
const Actions = styled.div`
  margin-top: 30px;
  text-align: right;
`
