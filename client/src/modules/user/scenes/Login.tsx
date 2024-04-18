import styled from 'styled-components'
import TextField from 'common/components/forms/TextField'
import { useTranslation } from 'react-i18next'
import logoIcon from 'common/assets/images/logo.png'
import ActionButton from 'common/components/buttons/ActionButton'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import i18n from 'i18n/i18n'
import { useState } from 'react'
import { login } from '../authApi'

type FormData = {
  username: string
  password: string
}

const schema = z.object({
  username: z.string().min(1, i18n.t('common.forms.requiredField')),
  password: z.string().min(1, i18n.t('common.forms.requiredField')),
})

type Props = {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const response = await login(data.username, data.password)
    if (!response.error) {
      onLogin()
    } else {
      setError('username', {
        message: t('user.login.errors.invalidCredentials'),
      })
      setError('password', {
        message: t('user.login.errors.invalidCredentials'),
      })
    }
    setLoading(false)
  }

  return (
    <Container data-testid="login-page">
      <Content>
        <Logo src={logoIcon} alt="Logo" />
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <h2>{t('user.login.title')}</h2>
          <TextField
            name="username"
            label={t('user.login.username')}
            required
            register={register}
            error={errors.username?.message}
          />
          <TextField
            type="password"
            name="password"
            label={t('user.login.password')}
            required
            register={register}
            error={errors.password?.message}
            autoComplete="0"
          />
          <Actions>
            <ActionButton raised type="submit" loading={loading}>
              {t('user.login.login')}
            </ActionButton>
          </Actions>
        </LoginForm>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const Content = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`
const Logo = styled.img`
  width: 100px;
`
const LoginForm = styled.form`
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  border-radius: 3px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`
const Actions = styled.div`
  margin-top: 20px;

  > button {
    width: 100%;
  }
`
