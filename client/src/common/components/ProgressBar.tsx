import styled from 'styled-components'

type ProgressBarProps = {
  value: number
  max: number
  label?: string
}

function ProgressBar({ value, max, label }: ProgressBarProps) {
  return (
    <Wrapper>
      <StyledProgress value={value} max={max} />
      {label && <Label>{label}</Label>}
    </Wrapper>
  )
}

export default ProgressBar

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 400px;
`
const StyledProgress = styled.progress`
  width: 100%;
  height: 8px;
  appearance: none;
  border: none;
  border-radius: 4px;
  overflow: hidden;

  &::-webkit-progress-bar {
    background-color: ${(props) => props.theme.colors.separator};
    border-radius: 4px;
  }

  &::-webkit-progress-value {
    background-color: ${(props) => props.theme.colors.buttonBackground};
    border-radius: 4px;
  }

  &::-moz-progress-bar {
    background-color: ${(props) => props.theme.colors.buttonBackground};
    border-radius: 4px;
  }
`
const Label = styled.span`
  font-size: 0.85em;
  color: ${(props) => props.theme.colors.textSecondary};
`
