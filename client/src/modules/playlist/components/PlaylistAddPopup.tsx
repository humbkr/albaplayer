import React, { FunctionComponent, useRef } from 'react'
import styled, { withTheme } from 'styled-components'
import Modal from 'react-modal'
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from 'formik'
import dayjs from 'dayjs'
import { getRandomInt } from 'common/utils/utils'
import ActionButton from 'common/components/ActionButton'
import { AppTheme } from 'themes/types'

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#root')

const PlaylistAddPopup: FunctionComponent<{
  id: string
  isOpen: boolean
  mode: string
  playlist: Playlist
  theme: AppTheme
  onClose: () => void
  onCreatePlaylist: (playlist: Playlist) => void
  onEditPlaylist: (playlist: Playlist) => void
}> = ({
  id,
  isOpen,
  onClose,
  mode = 'add',
  playlist = null,
  theme,
  onCreatePlaylist,
  onEditPlaylist,
}) => {
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
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
        onKeyDown={(e) => handleKeyDown(e)}
        tabIndex={0}
      >
        <Title>
          {mode === 'edit' && 'Edit playlist'}
          {mode !== 'edit' && 'Create a new playlist'}
        </Title>
        <Formik
          initialValues={{
            title: mode === 'edit' && playlist ? playlist.title : '',
          }}
          validate={(values) => {
            const errors: FormikErrors<any> = {}

            if (!values.title) {
              errors.title = 'This field is required.'
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
              <Label htmlFor="title">Title: </Label>
              <FormField
                autoComplete="off"
                type="text"
                name="title"
                innerRef={titleField}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.keyCode === 13) {
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
                  {mode === 'edit' && 'Edit'}
                  {mode !== 'edit' && 'Create'}
                </ActionButton>
                <ActionButton onClick={onClose}>Cancel</ActionButton>
              </Actions>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default withTheme(PlaylistAddPopup)

const ModalContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  color: ${(props) => props.theme.textPrimaryColor};
`
const Title = styled.h3`
  margin-bottom: 20px;
`
const Label = styled.label`
  display: block;
  color: ${(props) => props.theme.textSecondaryColor};
`
const FormField = styled(Field)`
  font-size: 1em;
  padding: 5px 10px;
  width: 100%;
  background-color: ${(props) => props.theme.inputs.backgroundColor};
`
const FormError = styled(ErrorMessage)`
  color: ${(props) => props.theme.messages.error.color};
  font-size: 0.9em;
`
const Actions = styled.div`
  margin-top: 30px;
  text-align: right;
`
