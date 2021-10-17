import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import selectArrow from 'common/assets/images/select_arrow.png'

interface Option {
  value: string
  label: string
}

const SelectList: FunctionComponent<{
  value: string
  onChangeHandler: (event: React.MouseEvent<HTMLSelectElement>) => void
  options: Array<Option>
  tabIndex?: string
  testId?: string
}> = ({
  value, onChangeHandler, options, testId, tabIndex = null,
}) => {
  const optionsHtml = options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))

  return (
    <Select
      tabIndex={tabIndex}
      id="select"
      value={value}
      onChange={onChangeHandler}
      data-testid={testId || 'select-list'}
    >
      {optionsHtml}
    </Select>
  )
}

export default SelectList

const Select = styled.select<any>`
  appearance: none;
  background-color: transparent;
  font-size: 1em;
  color: ${(props) => props.theme.buttons.color};
  border: 1px solid ${(props) => props.theme.buttons.color};
  border-radius: 2px;
  padding: 6px ${(props) => props.theme.buttons.sidePadding};
  min-width: 250px;
  background: url(${selectArrow}) no-repeat right
    ${(props) => props.theme.buttons.sidePadding} center;
  background-size: 12px;

  :hover {
    cursor: pointer;
  }
`
