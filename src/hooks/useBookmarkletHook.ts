import { useEffect, useRef } from 'react'

const CONTAINER_ID = 'bookmarklet-root'

export const useBookmarklet = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      // 언마운트 시 정리
      const container = document.getElementById(CONTAINER_ID)
      if (container) {
        container.remove()
      }
    }
  }, [])

  const getContainer = (): HTMLDivElement => {
    let container = document.getElementById(CONTAINER_ID)

    if (!container) {
      container = document.createElement('div')
      container.id = CONTAINER_ID
      document.body.appendChild(container)
    }

    return container as HTMLDivElement
  }

  const close = () => {
    const container = document.getElementById(CONTAINER_ID)
    if (container) {
      container.remove()
    }
  }

  return {
    containerRef,
    getContainer,
    close,
  }
}
