import type { GroupBase, Props, Options } from 'react-select'
import Select from 'react-select'
import Label from 'common/components/forms/Label'
import styled, { useTheme } from 'styled-components'

type SelectProps = {
  label?: string
}

type SelectComponentProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Props<Option, IsMulti, Group> & SelectProps

export default function SelectField<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: SelectComponentProps<Option, IsMulti, Group>) {
  const { label, ...rest } = props

  const theme = useTheme()

  return (
    <Container>
      {label && <Label htmlFor={rest.name}>{label}</Label>}
      <Select
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: '30px',
            minHeight: '30px',
            borderColor: theme.colors.buttonBackground,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            ':hover': {
              borderColor: theme.colors.buttonBackgroundHover,
            },
            boxShadow: state.isFocused
              ? `0px 0px 3px ${theme.colors.buttonBackgroundHover}`
              : 'none',
          }),
          dropdownIndicator: (baseStyles) => ({
            ...baseStyles,
            color: theme.colors.buttonBackground,
            padding: '0 8px',
            ':hover': {
              color: theme.colors.buttonBackgroundHover,
            },
          }),
          indicatorsContainer: (baseStyles) => ({
            ...baseStyles,
            height: '30px',
            marginTop: '-1px',
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.buttonBackground}`,
            overflow: 'hidden',
            width: 'max-content',
            minWidth: '100%',
          }),
          menuList: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            height: '30px',
            lineHeight: '13px',
            color: state.isSelected
              ? theme.colors.inputBackground
              : theme.colors.buttonBackground,
            backgroundColor: state.isSelected
              ? theme.colors.buttonBackground
              : 'transparent',
            '::selection': {
              color: theme.colors.buttonBackground,
              backgroundColor: theme.colors.buttonBackground,
            },
            ':active': {
              color: theme.colors.buttonBackground,
            },
            ':hover': {
              color: theme.colors.buttonBackground,
              backgroundColor: theme.colors.selectOptionBackgroundHover,
            },
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: theme.colors.buttonBackground,
            marginTop: '4px',
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: theme.colors.buttonBackground,
            height: '30px',
            display: 'flex',
            alignItems: 'center',
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            height: '30px',
            marginTop: '-6px',
          }),
        }}
        {...rest}
      />
    </Container>
  )
}

export function getSelectedOption<Option extends { value: string }>(options: Options<Option>, value: string) {
  return options.find((option) => option.value === value)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: fit-content;
`
