import { memo } from 'react'
import { css } from '@emotion/react'
import type { MenuItem } from '../types'
import { theme } from '../styles/theme'

interface BookmarkletMenuProps {
  items: MenuItem[]
}

const menuStyles = css`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`

const menuItemStyles = css`
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const menuButtonStyles = css`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  width: 100%;
  padding: ${theme.space[4]} ${theme.space[5]};
  background-color: ${theme.colors.background};
  text-align: left;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  transition: all ${theme.transition.base};
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.space[3]};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: transparent;
    transition: background-color ${theme.transition.fast};
  }

  &:hover {
    background-color: ${theme.colors.surface};

    &::before {
      background-color: ${theme.colors.primary};
    }
  }

  &:active {
    background-color: ${theme.colors.surfaceDark};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: -2px;
  }
`

const menuIconStyles = css`
  font-size: ${theme.fontSize.lg};
  flex-shrink: 0;
`

const menuLabelStyles = css`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const BookmarkletMenu = memo<BookmarkletMenuProps>(({ items }) => {
  return (
    <ul css={menuStyles}>
      {items.map((item) => (
        <li key={item.id} css={menuItemStyles}>
          <button css={menuButtonStyles} onClick={item.onClick} type="button">
            <span css={menuIconStyles}>{item.icon || '•'}</span>
            <span css={menuLabelStyles}>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
})

BookmarkletMenu.displayName = 'BookmarkletMenu'
