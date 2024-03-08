import styled from 'styled-components'

type Props = {
  id: string
  label: string
  onClick: (tabId: string) => void
  active?: boolean
}

function Tab({ id, label, onClick, active }: Props) {
  return (
    <div>
      <Button type="button" onClick={() => onClick(id)} active={active}>
        {label}
      </Button>
      {active && <ActiveIndicator />}
    </div>
  )
}

export default Tab

const Button = styled.button<{ active?: boolean }>`
  background-color: transparent;
  border: 0;
  color: ${(props) =>
    props.active
      ? props.theme.colors.elementHighlightFocus
      : props.theme.colors.textPrimary};
  font-weight: bold;
  font-size: 16px;
  height: 30px;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.colors.elementHighlightFocus};
  }
`

const ActiveIndicator = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.elementHighlightFocus};
  margin-bottom: -1px;
`
