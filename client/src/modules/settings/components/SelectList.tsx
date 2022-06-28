import React from 'react'
import styled from 'styled-components'
import selectArrowLight from '../../../common/assets/images/select-arrow-light.svg'
import selectArrowDark from '../../../common/assets/images/select-arrow-dark.svg'

type Option = {
  value: string
  label: string
}

type Props = {
  value: string
  onChangeHandler: (event: React.MouseEvent<HTMLSelectElement>) => void
  options: Array<Option>
  tabIndex?: string
  testId?: string
}

const SelectList = ({ value, onChangeHandler, options, testId, tabIndex = '' }: Props) => {
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
  background-image: url(${(props) =>
    props.theme.isDark ? selectArrowLight : selectArrowDark});
  background-repeat: no-repeat, repeat;
  background-position: right 1rem top 52%, 0 0;
  background-size: 0.65em auto, 100%;

  :hover {
    cursor: pointer;
  }
`
