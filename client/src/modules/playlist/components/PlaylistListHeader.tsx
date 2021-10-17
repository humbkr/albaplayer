import React from 'react'
import styled from 'styled-components'
import ActionButtonIcon from 'common/components/ActionButtonIcon'

const PlaylistListHeader: React.FC<{
  onAddClick: () => void
}> = ({ onAddClick }: { onAddClick: () => void }) => (
  <Wrapper>
    <h2>Playlists</h2>
    <Actions>
      <ActionButtonIcon icon="add" onClick={onAddClick} />
    </Actions>
  </Wrapper>
)

export default PlaylistListHeader

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => props.theme.itemHeight};
  color: ${(props) => props.theme.textSecondaryColor};
  padding-left: 15px;

  > h2 {
    display: table-cell;
    vertical-align: middle;
    font-size: 1.2em;
  }
`
const Actions = styled.div`
  :hover {
    color: ${(props) => props.theme.buttons.colorHover};
  }
`
