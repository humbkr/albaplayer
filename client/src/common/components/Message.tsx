import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Icon from 'common/components/Icon'

enum MessageType {
  'info' = 'info',
  'warning' = 'warning',
  'error' = 'error',
}

const Message: FunctionComponent<{ type: MessageType }> = ({
  type,
  children,
}) => {
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
  color: ${(props) => props.theme.messages[props.type].color};

  > * {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  > span {
    height: ${(props) => props.theme.messages.height};
    line-height: ${(props) => props.theme.messages.height};
  }
`
