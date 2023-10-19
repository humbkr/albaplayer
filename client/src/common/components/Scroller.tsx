import styled from 'styled-components'

type Props = {
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void
  children: React.ReactNode
}

function Scroller({ onScroll, children }: Props) {
  return <Container onScroll={onScroll}>{children}</Container>
}

export default Scroller

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`
