import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
// eslint-disable-next-line import/no-cycle
import PlaylistDetailPane from 'modules/playlist/components/PlaylistDetailsPane'
// eslint-disable-next-line import/no-cycle
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line import/no-cycle
import PlaylistListPane from '../components/PlaylistListPane'
import PlaylistAddPopup from '../components/PlaylistAddPopup'
import {
  playlistCreatePlaylist,
  PlaylistPane,
  playlistUpdateInfo,
} from '../redux'
import { RootState } from '../../../store/types'
import PlaylistsCarePane from '../components/PlaylistCarePane'

// Playlist edition must be accessible to the children of this component.
export const EditPlaylistContext = React.createContext(null)

const Playlists = () => {
  const [modalPlaylistIsOpen, setModalPlaylistIsOpen] = useState(false)
  const [modalPlaylistMode, setModalPlaylistMode] = useState('add')

  const selected = useSelector(
    (state: RootState) => state.playlist.currentPlaylist.playlist
  )
  const currentPane = useSelector(
    (state: RootState) => state.playlist.currentPane
  )

  const dispatch = useDispatch()

  const playlistListPane = useRef<HTMLDivElement>(null)
  const playlistDetailPane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Give focus to the search bar.
    // @ts-ignore
    playlistListPane.current.children[0].focus()
  }, [])

  const handleSwitchPaneList = (e: React.KeyboardEvent) => {
    if (e.keyCode === 39) {
      // @ts-ignore
      playlistDetailPane.current.children[0].focus()
    }
  }

  const handleSwitchPaneDetails = (e: React.KeyboardEvent) => {
    if (e.keyCode === 37) {
      // @ts-ignore
      playlistListPane.current.children[0].focus()
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
