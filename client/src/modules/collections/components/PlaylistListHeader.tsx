import styled from 'styled-components'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import { useTranslation } from 'react-i18next'

type Props = {
  onAddClick: () => void
}

function PlaylistListHeader({ onAddClick }: Props) {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <h2>{t('playlists.title')}</h2>
      <Actions>
        <ActionButtonIcon icon="add" onClick={onAddClick} />
      </Actions>
    </Wrapper>
  )
}

export default PlaylistListHeader

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => props.theme.layout.itemHeight};
  color: ${(props) => props.theme.colors.textSecondary};
  padding-left: 15px;

  > h2 {
    display: table-cell;
    vertical-align: middle;
    font-size: 1.2em;
  }
`
const Actions = styled.div`
  color: ${(props) => props.theme.buttons.backgroundColor};

  :hover {
    color: ${(props) => props.theme.buttons.backgroundColorHover};
  }
`
