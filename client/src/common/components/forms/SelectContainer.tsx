import type React from 'react'
import type { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import selectArrowLight from 'common/assets/images/select-arrow-light.svg'
import selectArrowDark from 'common/assets/images/select-arrow-dark.svg'
import Label from 'common/components/forms/Label'

export type Option = {
  value: string
  label: string
}

type Props = InputHTMLAttributes<HTMLSelectElement> & {
  label?: string
  value: string
  onChangeHandler: (event: React.MouseEvent<HTMLSelectElement>) => void
  options: Array<Option>
  id?: string
}

function SelectContainer({
  value,
  onChangeHandler,
  options,
  tabIndex,
  label,
  id = 'select-field',
  ...props
}: Props) {
  const optionsHtml = options.map((option: Option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))

  return (
    <SelectWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        tabIndex={tabIndex}
        id={id}
        value={value}
        onChange={onChangeHandler}
        {...props}
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
  color: ${(props) => props.theme.colors.textPrimary};
  display: block;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  box-sizing: border-box;
  margin: 0;
  appearance: none;
  border: 0;
  background-color: transparent;
  background-image: url('${(props) =>
    props.theme.isDark
      ? selectArrowLight.replaceAll("'", '"')
      : selectArrowDark.replaceAll("'", '"')}');
  background-repeat: no-repeat, repeat;
  background-position:
    right 0.3rem top 52%,
    0 0;
  background-size:
    0.65em auto,
    100%;

  &::-ms-expand {
    display: none;
  }

  &:hover {
    cursor: pointer;
    outline: none;
  }

  &:focus {
    outline: none;
  }

  option {
    font-weight: normal;
  }
`
const SelectWrapper = styled.div`
  text-align: right;
`
