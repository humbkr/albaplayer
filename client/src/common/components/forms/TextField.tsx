import styled from 'styled-components'
import { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label?: string
  type?: string
  register?: any
  required?: boolean
  error?: string
}

function TextField({
  name,
  label,
  type = 'text',
  register,
  required,
  error,
  ...rest
}: Props) {
  return (
    <Container>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        type={type}
        id={name}
        {...(register ? register(name, { required }) : {})}
        error={error}
        // We need to stop propagation of the keydown event to prevent the space key from
        // triggering the play/pause action in the player.
        onKeyDown={(event) => event.stopPropagation()}
        {...rest}
      />
      {error && <Error role="alert">{error}</Error>}
    </Container>
  )
}

export default TextField

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.label`
  margin-bottom: 3px;
  font-size: 0.9rem;
`
const Input = styled.input<{ error: boolean }>`
  height: 30px;
  border-radius: 3px;
  border: 0;
  padding: 0 10px;
  font-size: 15px;
  background-color: ${(props) => props.theme.colors.inputBackground};

  ${(props) => props.error && `border: 1px solid ${props.theme.colors.error};`}
`
const Error = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 3px;
`
