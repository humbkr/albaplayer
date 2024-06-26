import React from 'react'
import styled from 'styled-components'
import Icon from 'common/components/Icon'

enum MessageType {
  'info' = 'info',
  'warning' = 'warning',
  'error' = 'error',
}

type Props = {
  type: MessageType
  children?: React.ReactNode
}

function Message({ type, children }: Props) {
  let Picto
  switch (type) {
    case MessageType.info:
      Picto = <Icon>info</Icon>
      break
    case MessageType.warning:
      Picto = <Icon>warning</Icon>
      break
    case MessageType.error:
      Picto = <Icon>error</Icon>
      break
    default:
  }

  return (
    <MessageWrapper type={type}>
      {Picto}
      <span>{children}</span>
    </MessageWrapper>
  )
}

export default Message
export { MessageType }

const MessageWrapper = styled.div<{ type: MessageType }>`
  color: ${(props) => props.theme.colors[props.type]};

  > * {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  > span {
    height: 32px;
    line-height: 32px;
  }
`
