import styled from 'styled-components'

const Icon = styled.i<{ size?: number }>`
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: ${(props) => props.size || 24}px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
`

export default Icon
