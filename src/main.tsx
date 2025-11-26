import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Global, css } from '@emotion/react'
import { BookmarkletUI } from './components/BookmarkletUI'
import type { MenuItem } from './types'
import { theme } from './styles/theme'

const CONTAINER_ID = 'bookmarklet-root'

const GlobalStyles = () => (
  <Global
    styles={css`
      #${CONTAINER_ID} {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        font-size: 1rem;
        line-height: 1.5;
        color: ${theme.colors.textPrimary};
      }

      #${CONTAINER_ID} * {
        box-sizing: border-box;
      }
    `}
  />
)

const initializeBookmarklet = (config?: {
  title?: string
  menuItems?: MenuItem[]
}) => {
  const existingContainer = document.getElementById(CONTAINER_ID)
  if (existingContainer) {
    existingContainer.remove()
    return
  }

  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(
    <StrictMode>
      <GlobalStyles />
      <BookmarkletUI
        title={config?.title}
        menuItems={config?.menuItems ?? defaultMenuItems}
        onClose={() => {
          root.unmount()
          container.remove()
        }}
      />
    </StrictMode>
  )
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 'alert-test',
    label: '알럿 테스트',
    icon: '⚡',
    onClick: () => {
      alert('Bookmarklet이 정상적으로 작동합니다! 🎉')
    },
  },
  {
    id: 'copy-url',
    label: '현재 URL 복사',
    icon: '🔗',
    onClick: () => {
      navigator.clipboard.writeText(window.location.href)
      alert('URL이 복사되었습니다!')
    },
  },
  {
    id: 'dark-mode',
    label: '다크모드 토글',
    icon: '🌙',
    onClick: () => {
      document.body.style.filter =
        document.body.style.filter === 'invert(1)' ? '' : 'invert(1)'
    },
  },
]

;(function () {
  initializeBookmarklet()
})()
