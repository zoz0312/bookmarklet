import { useRef, useState, useEffect } from 'react'
import { css, keyframes } from '@emotion/react'
import { useDrag } from '../hooks/useDrag'
import { BookmarkletHeader } from './BookmarkletHeader'
import { BookmarkletMenu } from './BookmarkletMenu'
import type { MenuItem } from '../types'
import { theme } from '../styles/theme'

interface BookmarkletUIProps {
  title?: string
  menuItems: MenuItem[]
  onClose: () => void
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
`

const wrapperStyles = css`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  right: ${theme.space[5]};
  width: 320px;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.lg}, 0 0 40px rgba(99, 102, 241, 0.15);
  z-index: 999999;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  animation: ${slideIn} 200ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const containerStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const contentStyles = css`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.3);
    border-radius: 3px;

    &:hover {
      background-color: rgba(99, 102, 241, 0.5);
    }
  }
`

const draggingStyles = css`
  box-shadow: ${theme.shadows.lg}, 0 0 50px rgba(99, 102, 241, 0.25);
  opacity: 0.95;
`

export const BookmarkletUI = ({
  title = 'Bookmarklet',
  menuItems,
  onClose,
}: BookmarkletUIProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(300)
  const { position, isDragging, handlers } = useDrag({
    containerHeight,
  })

  useEffect(() => {
    const measureHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight)
      }
    }

    measureHeight()

    const observer = new ResizeObserver(measureHeight)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      css={[wrapperStyles, isDragging && draggingStyles]}
      style={{
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
      onMouseMove={handlers.onMouseMove}
      onMouseUp={handlers.onMouseUp}
      onMouseLeave={handlers.onMouseLeave}
    >
      <div css={containerStyles}>
        <BookmarkletHeader
          title={title}
          onClose={onClose}
          onMouseDown={handlers.onHeaderMouseDown}
        />
        <div css={contentStyles}>
          <BookmarkletMenu items={menuItems} />
        </div>
      </div>
    </div>
  )
}
