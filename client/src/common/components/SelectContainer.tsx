import React from 'react'
import styled from 'styled-components'
import selectArrowLight from '../assets/images/select-arrow-light.svg'
import selectArrowDark from '../assets/images/select-arrow-dark.svg'

export type Option = {
  value: string
  label: string
}

type Props = {
  value: string
  onChangeHandler: (event: React.MouseEvent<HTMLSelectElement>) => void
  options: Array<Option>
  tabIndex?: string
}

function SelectContainer({ value, onChangeHandler, options, tabIndex }: Props) {
  const optionsHtml = options.map((option: Option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))

  return (
    <SelectWrapper>
      <Select
        tabIndex={tabIndex}
        id="select"
        value={value}
        onChange={onChangeHandler}
      >
        {optionsHtml}
      </Select>
    </SelectWrapper>
  )
}

export default SelectContainer

const Select = styled.select<any>`
  font-weight: bold;
  font-size: 1em;
  text-align-last: center;
  color: ${(props) => props.theme.textPrimaryColor};
  display: block;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  box-sizing: border-box;
  margin: 0;
  appearance: none;
  border: 0;
  background-color: transparent;
  background-image: url(${(props) =>
    props.theme.isDark ? selectArrowLight : selectArrowDark});
  background-repeat: no-repeat, repeat;
  background-position: right 0.3rem top 52%, 0 0;
  background-size: 0.65em auto, 100%;

  &::-ms-expand {
    display: none;
  }
  :hover {
    cursor: pointer;
    outline: none;
  }
  :focus {
    outline: none;
  }
  option {
    font-weight: normal;
  }
`
const SelectWrapper = styled.div`
  text-align: right;
`
