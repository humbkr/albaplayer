// Jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-styled-components'

// @ts-ignore
import * as matchers from 'jest-extended'
import React, { ReactNode } from 'react'
expect.extend(matchers)

// React-i18next
// see: https://github.com/i18next/react-i18next/blob/master/example/test-jest/src/__mocks__/react-i18next.js
const hasChildren = (node: ReactNode) =>
  // @ts-ignore
  node && (node.children || (node.props && node.props.children))

const getChildren = (node: ReactNode) =>
  // @ts-ignore
  node && node.children ? node.children : node.props && node.props.children

// @ts-ignore
const renderNodes = (reactNodes: ReactNode[] | string) => {
  if (typeof reactNodes === 'string') {
    return reactNodes
  }

  return Object.keys(reactNodes).map((key, i) => {
    // @ts-ignore
    const child = reactNodes[key]
    const isElement = React.isValidElement(child)

    if (typeof child === 'string') {
      return child
    }
    if (hasChildren(child)) {
      // @ts-ignore
      const inner = renderNodes(getChildren(child))
      // eslint-disable-next-line react/no-array-index-key
      return React.cloneElement(child, { ...child.props, key: i }, inner)
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce(
        (str, childKey) => `${str}${child[childKey]}`,
        ''
      )
    }

    return child
  })
}

jest.mock('react-i18next', () => ({
  Trans: ({ children }: { children: ReactNode }) =>
    Array.isArray(children) ? renderNodes(children) : renderNodes([children]),
  useTranslation: () => ({
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
    t: (str: any, params: any) =>
      `${str}${params ? ` ${JSON.stringify(params)}` : ''}`,
  }),
}))
