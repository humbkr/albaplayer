import { cssTransition, toast, ToastContainer } from 'react-toastify'
import Icon from 'common/components/Icon'
import styled from 'styled-components'

export type NotificationType = 'success' | 'warning' | 'error' | 'info'

const CustomSlide = cssTransition({
  enter: 'notifications-slide-in-right',
  exit: 'notifications-slide-out-right',
})

export function notify(message: string, type: NotificationType = 'info') {
  let content
  switch (type) {
    case 'success':
      content = (
        <Content>
          <NotificationIcon type={type}>check_circle</NotificationIcon>{' '}
          {message}
        </Content>
      )
      break
    case 'warning':
      content = (
        <Content>
          <NotificationIcon type={type}>warning</NotificationIcon> {message}
        </Content>
      )
      break
    case 'error':
      content = (
        <Content>
          <NotificationIcon type={type}>error</NotificationIcon> {message}
        </Content>
      )
      break
    case 'info':
    default:
      content = (
        <Content>
          <NotificationIcon type={type}>info</NotificationIcon> {message}
        </Content>
      )
  }

  toast(content, {
    className: `notifications-${type}`,
  })
}

export function NotificationsContainer() {
  return (
    <ToastContainer
      autoClose={1500}
      draggable={false}
      transition={CustomSlide}
    />
  )
}

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 10px;
`
const NotificationIcon = styled(Icon)<{ type: NotificationType }>`
  color: ${(props) => props.theme.colors[props.type]};
`
