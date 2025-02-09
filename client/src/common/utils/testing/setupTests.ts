import '@testing-library/jest-dom/vitest'
import 'jest-styled-components'
import type { ReactNode } from 'react'
import React from 'react'

// React-i18next
// see: https://github.com/i18next/react-i18next/blob/master/example/test-jest/src/__mocks__/react-i18next.js
const hasChildren = (node: ReactNode) =>
  // @ts-ignore
  node && (node.children || (node.props && node.props.children))

const getChildren = (node: ReactNode) =>
  // @ts-ignore
  node && node.children ? node.children : node.props && node.props.children

const renderNodes = (reactNodes: ReactNode[] | string): ReactNode => {
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
      const inner = renderNodes(getChildren(child))
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

vi.mock('react-i18next', () => ({
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
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}))

// @ts-ignore
vi.mock(import('i18n/i18n'), async (importOriginal) => {
  const actual = await importOriginal()

  return {
    default: {
      ...actual,
      t: (str: any, params: any) =>
        `${str}${params ? ` ${JSON.stringify(params)}` : ''}`,
    },
  }
})

// Mock our app API calls by default. This avoids issues when creating the redux store.
// Users are free to override these mocks in their tests.

vi.mock('modules/library/api', () => ({
  default: {
    getLibrary: vi.fn().mockResolvedValue({}),
    scanLibrary: vi.fn().mockResolvedValue({}),
    emptyLibrary: vi.fn().mockResolvedValue({}),
  },
}))
vi.mock('api/helpers', () => ({
  processApiError: vi.fn(),
}))
