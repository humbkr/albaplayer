import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
// eslint-disable-next-line import/no-cycle
import PlaylistDetailPane from 'modules/playlist/components/PlaylistDetailsPane'
// eslint-disable-next-line import/no-cycle
import { useAppSelector } from 'store/hooks'
import PlaylistEditModal from 'modules/playlist/components/PlaylistEditModal'
import PlaylistListPane from '../components/PlaylistListPane'
import { PlaylistPane } from '../store'
import PlaylistsCarePane from '../components/PlaylistCarePane'

// Playlist edition must be accessible to the children of this component.
export const EditPlaylistContext = React.createContext<() => void>(() => {})

function Playlists() {
  const [modalPlaylistIsOpen, setModalPlaylistIsOpen] = useState(false)
  const [addNewPlaylist, setAddNewPlaylist] = useState(false)

  const selected = useAppSelector((state) => state.playlist.currentPlaylist)
  const currentPane = useAppSelector((state) => state.playlist.currentPane)

  const playlistListPane = useRef<HTMLDivElement>(null)
  const playlistDetailPane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Give focus to the playlist list pane.
    // @ts-ignore
    playlistListPane.current?.children[0].focus()
  }, [])

  const handleSwitchPaneList = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      // @ts-ignore
      playlistDetailPane.current?.children[0].focus()
    }
  }

  const handleSwitchPaneDetails = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      // @ts-ignore
      playlistListPane.current?.children[0].focus()
    }
  }

  const handleNewPlaylist = () => {
    setAddNewPlaylist(true)
    setModalPlaylistIsOpen(true)
  }

  const handleEditPlaylist = () => {
    setAddNewPlaylist(false)
    setModalPlaylistIsOpen(true)
  }

  const handleOnModalClose = () => {
    setAddNewPlaylist(false)
    setModalPlaylistIsOpen(false)
  }

  return (
    <Container>
      <EditPlaylistContext.Provider value={handleEditPlaylist}>
        <PlaylistListPane
          ref={playlistListPane}
          openPlaylistModal={handleNewPlaylist}
          switchPaneHandler={handleSwitchPaneList}
        />
        {currentPane === PlaylistPane.Detail && (
          <PlaylistDetailPane
            ref={playlistDetailPane}
            switchPaneHandler={handleSwitchPaneDetails}
          />
        )}
        {currentPane === PlaylistPane.Fix && <PlaylistsCarePane />}
        <PlaylistEditModal
          playlist={addNewPlaylist ? undefined : selected}
          isOpen={modalPlaylistIsOpen}
          onClose={handleOnModalClose}
        />
      </EditPlaylistContext.Provider>
    </Container>
  )
}

export default Playlists

const Container = styled.div`
  display: grid;
  grid-template-columns: 34% 66%;
  width: 100%;
  height: 100%;
`
