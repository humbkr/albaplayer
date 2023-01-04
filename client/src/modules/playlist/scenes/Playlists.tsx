import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
// eslint-disable-next-line import/no-cycle
import PlaylistDetailPane from 'modules/playlist/components/PlaylistDetailsPane'
// eslint-disable-next-line import/no-cycle
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PlaylistListPane from '../components/PlaylistListPane'
import PlaylistAddPopup from '../components/PlaylistAddPopup'
import {
  playlistCreatePlaylist,
  PlaylistPane,
  playlistUpdateInfo,
} from '../store'
import PlaylistsCarePane from '../components/PlaylistCarePane'

// Playlist edition must be accessible to the children of this component.
export const EditPlaylistContext = React.createContext(null)

function Playlists() {
  const [modalPlaylistIsOpen, setModalPlaylistIsOpen] = useState(false)
  const [modalPlaylistMode, setModalPlaylistMode] = useState('add')

  const selected = useAppSelector(
    (state) => state.playlist.currentPlaylist.playlist
  )
  const currentPane = useAppSelector((state) => state.playlist.currentPane)

  const dispatch = useAppDispatch()

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

  const handleCreatePlaylist = (playlist: Playlist) => {
    dispatch(playlistCreatePlaylist(playlist))
  }

  const handleEditPlaylist = (playlist: Playlist) => {
    dispatch(playlistUpdateInfo(playlist))
  }

  const openPlaylistModal = (mode: string = 'add') => {
    setModalPlaylistIsOpen(true)
    setModalPlaylistMode(mode)
  }

  return (
    <Wrapper>
      <EditPlaylistContext.Provider
        // @ts-ignore
        value={openPlaylistModal}
      >
        <PlaylistListPane
          ref={playlistListPane}
          openPlaylistModal={openPlaylistModal}
          switchPaneHandler={handleSwitchPaneList}
        />
        {currentPane === PlaylistPane.Detail && (
          <PlaylistDetailPane
            ref={playlistDetailPane}
            switchPaneHandler={handleSwitchPaneDetails}
          />
        )}
        {currentPane === PlaylistPane.Fix && <PlaylistsCarePane />}
        <PlaylistAddPopup
          id="playlist-add-modal"
          onClose={() => setModalPlaylistIsOpen(false)}
          isOpen={modalPlaylistIsOpen}
          mode={modalPlaylistMode}
          playlist={selected}
          onCreatePlaylist={handleCreatePlaylist}
          onEditPlaylist={handleEditPlaylist}
        />
      </EditPlaylistContext.Provider>
    </Wrapper>
  )
}

export default Playlists

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 34% 66%;
  width: 100%;
  height: 100vh;
`
