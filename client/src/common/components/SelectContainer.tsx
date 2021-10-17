import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

export interface Option {
  value: string
  label: string
}

const SelectContainer: FunctionComponent<{
  value: string
  onChangeHandler: (event: React.MouseEvent<HTMLSelectElement>) => void
  options: Array<Option>
  tabIndex?: string
}> = ({
  value, onChangeHandler, options, tabIndex,
}) => {
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
  border: none;
  background-color: transparent;
  font-weight: bold;
  font-size: 1em;
  text-align-last: center;
  color: ${(props) => props.theme.textPrimaryColor};

  :hover {
    cursor: pointer;
  }
`
const SelectWrapper = styled.div`
  text-align: right;
`
