import styled from 'styled-components'

export type CheckboxOption = {
  label: string
  value: string
  description?: string
}

type Props = {
  name: string
  label?: string
  options: CheckboxOption[]
  mandatoryOptions?: string[]
  disabledOptions?: string[]
  register?: any
}

function Checkboxes({
  name,
  label,
  options,
  mandatoryOptions,
  disabledOptions,
  register,
}: Props) {
  return (
    <Fieldset>
      <Legend aria-label={label}>{label}</Legend>
      {options.map((option) => (
        <Option key={option.value}>
          <input
            type="checkbox"
            id={option.value}
            name={name}
            value={option.value}
            defaultChecked={mandatoryOptions?.includes(option.value)}
            disabled={
              mandatoryOptions?.includes(option.value) ||
              disabledOptions?.includes(option.value)
            }
            {...(register ? register(name) : {})}
          />
          <label htmlFor={option.value} title={option.description}>
            {option.label}
          </label>
        </Option>
      ))}
    </Fieldset>
  )
}

export default Checkboxes

const Fieldset = styled.fieldset`
  border: 0;
`
const Legend = styled.label`
  font-size: 0.9rem;
  margin-bottom: 3px;
`
const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
`
